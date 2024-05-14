mod language;
mod manager;
mod utils;
use std::collections::HashMap;

use language::*;
use mysql_async::prelude::*;
use mysql_async::Conn;
use mysql_async::Row;
use rayon::prelude::*;
use tokio;

type ControlReceiver = tokio::sync::mpsc::UnboundedReceiver<Control>;
type ControlSender = tokio::sync::mpsc::UnboundedSender<Control>;
type ControlChannel = (ControlSender, ControlReceiver);

#[derive(Debug)]
enum Job {
    CPlusPlus(language::CPlusPlus),
    Unknwon(u64),
}
impl Job {
    async fn run(self, tx: ControlSender, rx: ControlReceiver) -> RunResult {
        println!("run req {:?}------------------------------------------", self);
        let result = match self {
            Job::CPlusPlus(mut c) => c.run(tx, rx).await,
            Job::Unknwon(id) => RunResult::error(id, "Unknown language".to_string()),
        };
        println!("--> result {:?}", result);
        return result;
    }

    fn get_no(&self) -> u64 {
        match self {
            Job::CPlusPlus(c) => c.get_no(),
            Job::Unknwon(id) => *id,
        }
    }

    fn new(submission: Submission) -> Self {
        unimplemented!();
    }
}

#[derive(Debug, Clone)]
enum ControlType {
    Input(String),
    Output(String),
    Error(String),
    Stop,
    End,
}
#[derive(Debug)]
pub struct Control {
    cmd_id: Option<u64>,
    job_id: u64,
    data: ControlType,
}
impl Control {
    fn new(cmd_id: Option<u64>, job_id: u64, data: ControlType) -> Self {
        Self {
            cmd_id,
            job_id,
            data,
        }
    }
}

fn main() {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(main_loop());
}

async fn main_loop() {
    let (control_bridge_tx, control_bridge_rx) =
        tokio::sync::mpsc::unbounded_channel::<(u64, ControlSender)>();

    let (manager_tx, manager_rx) = tokio::sync::mpsc::unbounded_channel::<Control>();

    tokio::spawn(manager::main_loop(manager_rx, control_bridge_rx));

    let cpu_count = num_cpus::get();
    let job_count = std::sync::Arc::<_>::new(std::sync::atomic::AtomicUsize::new(0));

    loop {
        if let Ok(jobs) = list_jobs().await {
            for job in jobs {
                println!("start job {:?}", job);

                let (job_tx, job_rx) = tokio::sync::mpsc::unbounded_channel::<Control>();

                control_bridge_tx.send((job.get_no(), job_tx));

                let job_count_ref = job_count.clone();
                job_count_ref.fetch_add(1, std::sync::atomic::Ordering::SeqCst);

                let manager_tx = manager_tx.clone();
                tokio::spawn(async move {
                    let job_id = job.get_no();

                    let timeout = tokio::time::timeout(
                        std::time::Duration::from_secs(10),
                        job.run(manager_tx.clone(), job_rx),
                    );

                    let result = match timeout.await {
                        Ok(result) => result,
                        Err(_) => RunResult::error(job_id, "실행시간 초과 (10초)".to_string()),
                    };
                    job_count_ref.fetch_sub(1, std::sync::atomic::Ordering::Release);

                    if let Err(err) = result.result {
                        manager_tx.send(Control::new(None, job_id, ControlType::Error(err)));
                    }

                    manager_tx.send(Control {
                        cmd_id: None,
                        job_id,
                        data: ControlType::Stop,
                    });
                });

                tokio::time::sleep(tokio::time::Duration::from_millis(300)).await;

                while job_count.load(std::sync::atomic::Ordering::Acquire) >= cpu_count {
                    tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
                }
            }

            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }else if let Err(err) = list_jobs().await {
            println!("list_jobs error {:?}", err);
            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        }
    }
}

async fn list_jobs() -> Result<Vec<Job>, Box<dyn std::error::Error>> {
    let pool = mysql_async::Pool::new(utils::MYSQL_SERVER_URL);
    let mut conn = pool.get_conn().await?;

    println!("select Code_jobs");

    let mut query =
    "select `id`, `language`, `code`, `status_updated` from Code_jobs where status = \"que\""
    .with(())
    .run(&mut conn)
    .await?;

    let result_set = query
        .map(|Row| {
            let mut row = Row.unwrap();
            let id = row.remove(0);
            let lang = row.remove(0);
            let code = row.remove(0);
            let status_updated = row.remove(0);
            println!(
                "id: {:?}, lang: {:?}, code: {:?}, status: {:?}, status_updated: {:?} ",
                id, lang, code, "que", status_updated
            );

            let submission = Submission::new(
                mysql_async::from_value(id),
                mysql_async::from_value(lang),
                mysql_async::from_value(code),
                mysql_async::from_value(status_updated),
            );
            match submission.language.to_lowercase().as_str() {
                "cpp" => Job::CPlusPlus(language::CPlusPlus::new(submission)),
                _ => Job::Unknwon(submission.id),
            }
        })
        .await;

    return Ok(result_set.unwrap_or(vec![]));
}
