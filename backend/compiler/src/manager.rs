use crate::*;
use std::collections::HashMap;

use language::*;
use mysql_async::prelude::*;
use mysql_async::Conn;
use tokio;
use utils;
use crate::ControlType;

struct JobDbUpdateStatus(pub u64, pub String);
struct JobDbUpdateOutput(pub u64, pub String, pub Option<String>);
#[derive(Debug)]
enum JobDbUpdate {
    Status(u64, String),
    Output(u64, String, Option<String>),
}
pub async fn main_loop(
    mut manager_rx: ControlReceiver,
    mut bridge_rx: tokio::sync::mpsc::UnboundedReceiver<(u64, ControlSender)>,
) {
    let mut job_controller: HashMap<u64, (ControlSender, String)> = HashMap::with_capacity(128);

    let mut job_update_queue: Vec<JobDbUpdate> = Vec::with_capacity(128);

    let mut db_check_interval = tokio::time::interval(std::time::Duration::from_millis(300));
    let mut db_update_interval = tokio::time::interval(std::time::Duration::from_millis(80));

    loop {
        tokio::select! {
            msg = manager_rx.recv() => {
                println!("manager_rx recv {:?}", msg);
                if msg.is_none() { continue; }
                let msg = msg.unwrap();

                match msg.data {
                    ControlType::Output(output) => {
                        if let Some(_) = job_controller.get_mut(&msg.job_id) {
                            job_update_queue.push(JobDbUpdate::Output(msg.job_id, output, None));
                        }
                    },
                    ControlType::Error(error) => {
                        job_update_queue.push(JobDbUpdate::Output(msg.job_id, "".to_string(), Some(error)));
                    },
                    ControlType::End | ControlType::Stop => {
                        job_controller.remove(&msg.job_id);
                        job_update_queue.push(JobDbUpdate::Status(msg.job_id, "done".to_string()));
                    },
                    _ => ()
                }
            },
            msg = bridge_rx.recv() => {
                println!("bridge_rx recv {:?}", msg);

                if msg.is_none() { continue; }
                let msg = msg.unwrap();


                let (job_id, sender) = msg;
                job_update_queue.push(JobDbUpdate::Status(job_id, "start".to_string()));
                job_controller.insert(job_id, (sender, String::new()));
            },
            _ = db_check_interval.tick() => {
                if let Ok(mut controls) = list_controls().await {
                    let completed_commands = controls
                        .drain(..)
                        .map(|ctrl| {
                            match job_controller.get(&ctrl.job_id) {
                                Some((sender, _)) => {
                                    if let ControlType::Input(_) = ctrl.data.clone() {
                                        job_update_queue.push(JobDbUpdate::Output(ctrl.job_id, "\n".to_string(), None));
                                    }

                                    sender.send(Control {
                                        cmd_id: ctrl.cmd_id,
                                        job_id: ctrl.job_id,
                                        data: ctrl.data,
                                    });
                                }
                                _ => {
                                    return None
                                },
                            };

                            return Some(ctrl.cmd_id);
                        }).filter(|result| result.is_some()).map(|result| result.unwrap()).filter(|cmd_id| cmd_id.is_some()).map(|cmd_id| cmd_id.unwrap());

                    tokio::spawn(update_control_status(completed_commands.collect(), 1));
                }
            }
            _ = db_update_interval.tick(), if job_update_queue.len() > 0 => {
                let mut db_output = Vec::with_capacity(128);
                let mut db_status = Vec::with_capacity(128);

                for update in job_update_queue.drain(..) {
                    match update {
                        JobDbUpdate::Output(job_id, output, error) => {
                            db_output.push(JobDbUpdateOutput(job_id, output, error));
                        },
                        JobDbUpdate::Status(job_id, status) => {
                            db_status.push(JobDbUpdateStatus(job_id, status));
                        }
                    }
                }

                tokio::spawn(update_job_output(db_output));
                tokio::spawn(update_job_status(db_status));
            }
        }
    }
}

async fn list_controls() -> Result<Vec<Control>, &'static str> {
    let pool = mysql_async::Pool::new(utils::MYSQL_SERVER_URL);
    let mut conn = pool.get_conn().await.map_err(|_| "DB 연결 실패")?;

    let result = conn
        .query_map::<(u64, u64, String, String), _, _, _>(
            "SELECT id, job_id, ctrl, data FROM Code_control WHERE status = 0",
            |(cmd_id, job_id, ctrl, data)| -> Control {
                let ctrl = match ctrl.as_str() {
                    "input" => ControlType::Input(data),
                    "stop" => ControlType::Stop,
                    _ => ControlType::Stop,
                };

                Control::new(Some(cmd_id), job_id, ctrl)
            },
        )
        .await
        .map_err(|_| "query error")?;

    Ok(result)
}

async fn update_job_status(mut list: Vec<JobDbUpdateStatus>) {
    if list.len() == 0 {
        return;
    }

    loop {
        let pool = mysql_async::Pool::new(utils::MYSQL_SERVER_URL);
        let conn = pool.get_conn().await;

        if conn.is_err() {
            pool.disconnect().await;
            continue;
        }

        let update_status = r"UPDATE Code_jobs SET status = :status WHERE id = :id;"
            .with(list.drain(..).map(|status| {
                params! {
                    "id" => status.0,
                    "status" => status.1,
                }
            }))
            .batch(&mut conn.unwrap())
            .await;

        println!("update_status {:?}", update_status);

        if update_status.is_ok() {
            pool.disconnect().await;
            break;
        }
    }
}
async fn update_job_output(mut list: Vec<JobDbUpdateOutput>) {
    if list.len() == 0 {
        return;
    }

    loop {
        let pool = mysql_async::Pool::new(utils::MYSQL_SERVER_URL);
        let conn = pool.get_conn().await;

        if conn.is_err() {
            pool.disconnect().await;
            continue;
        }

        let insert_result =
            r"UPDATE Code_jobs SET output = CONCAT(IFNULL(output, ''), :output), error = :error where id = :id;"
                .with(list.drain(..).map(|output| {
                    params! {
                        "id" => output.0,
                        "output" => output.1,
                        "error" => output.2.unwrap_or("".to_string())
                    }
                }))
                .batch(&mut conn.unwrap())
                .await;
        println!("ouput update -> {:?}", insert_result);

        if insert_result.is_ok() {
            pool.disconnect().await;
            break;
        }
    }
}

// async fn list_jobs() -> Result<Vec<Job>, Box<dyn std::error::Error>> {
//     let pool = mysql_async::Pool::new(MYSQL_SERVER_URL);
//     let mut conn = pool.get_conn().await?;

//     println!("select code_jobs");

//     Ok("select * from code_jobs"
//         .with(())
//         .map::<(u64, String, String, String, mysql_async::Value), Job, _, &mut Conn>(
//             &mut conn,
//             |(id, langauge, code, status, status_updated)| {
//                 let submission = Submission::new(id, langauge, status, code, status_updated);

//                 match submission.language.to_lowercase().as_str() {
//                     "cpp" => Job::CPlusPlus(language::CPlusPlus::new(submission)),
//                     "python" => Job::Python(language::Python::new(submission)),
//                     "java" => Job::Java(language::Java::new(submission)),
//                     _ => Job::Unknwon(submission.id),
//                 }
//             },
//         )
//         .await
//         .unwrap_or(vec![]))
// }

async fn update_control_status(cmd_id: Vec<u64>, status: usize) {
    if cmd_id.len() == 0 {
        return;
    }

    loop {
        let pool = mysql_async::Pool::new(utils::MYSQL_SERVER_URL);
        let conn = pool.get_conn().await;

        if conn.is_err() {
            pool.disconnect().await;
            continue;
        }

        let update_result = r"UPDATE Code_control SET status = :status WHERE id = :id"
            .with(cmd_id.iter().map(|cmd_id| {
                params! {
                    "id" => cmd_id,
                    "status" => status,
                }
            }))
            .batch(&mut conn.unwrap())
            .await;

        if update_result.is_ok() {
            pool.disconnect().await;
            break;
        }
    }
}
