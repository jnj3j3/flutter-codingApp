use bytes::*;
use std::io::Write;
use std::os::unix::process::ExitStatusExt;
use std::process::Stdio;
use tokio::io::AsyncReadExt;
use tokio::io::AsyncWriteExt;

use super::{Language, RunResult, Submission};
use crate::{ControlReceiver, ControlSender};

#[derive(Debug)]
pub struct CPlusPlus {
    submission: Submission,
}

impl Language for CPlusPlus {
    fn new(submission: Submission) -> Self {
        Self { submission }
    }

    fn get_no(&self) -> u64 {
        self.submission.id
    }
}

impl CPlusPlus {
    pub async fn run(self, tx: ControlSender, mut rx: ControlReceiver) -> RunResult {
        let filename = format!("kuku-{}.cpp", self.submission.id);
        let file = std::fs::File::create(format!("/tmp/{}", filename));
        if let Err(e) = file {
            return RunResult::error(
                self.submission.id,
                format!("error while create src: {}", e.to_string()),
            );
        }

        let mut file = file.unwrap();
        file.write(self.submission.code.as_bytes());

        let maxium_memory_MB = 512usize;

        let result = tokio::process::Command::new("docker")
            .arg("run")
            .arg("-i")
            .arg("--cpus=1")
            .arg(format!("--memory={}m", maxium_memory_MB))
            .arg("-v")
            .arg(format!("/tmp/{}:/app/test.cpp", filename))
            .arg("container-cpp")
            .stderr(Stdio::piped())
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn();

        let mut spawn = match result {
            Ok(spawn) => spawn,
            Err(e) => {
                tx.send(crate::Control {
                    cmd_id: None,
                    job_id: self.submission.id,
                    data: crate::ControlType::Error(e.to_string()),
                });

                return RunResult::error(
                    self.submission.id,
                    format!("error while run {:?}", e.to_string()),
                );
            }
        };

        let (mut stdin, mut stdout, mut stderr) =
            match (spawn.stdin.take(), spawn.stdout.take(), spawn.stderr.take()) {
                (Some(stdin), Some(stdout), Some(stderr)) => (stdin, stdout, stderr),
                _ => {
                    return RunResult::error(
                        self.submission.id,
                        "stdin, stderr or stdout is None".to_string(),
                    );
                }
            };

        let mut stdout_buf = BytesMut::with_capacity(4096);
        let mut stderr_buf = BytesMut::with_capacity(4096);
        let mut exit_status: Option<_> = None;

        loop {
            tokio::select! {
                rx = rx.recv() => {
                    let rx = match rx {
                        Some(rx) => rx,
                        None => {
                            return RunResult::error(self.submission.id, "rx is none".to_string());
                        }
                    };

                    match rx.data {
                        crate::ControlType::Stop => {
                            spawn.kill().await;
                            return RunResult::error(self.submission.id, "killed".to_string());
                        }
                        crate::ControlType::Input(mut s) => {
                            s.push_str("\n");

                            stdin.write(s.as_bytes()).await;
                            println!("--> input: {}", s);
                        }
                        _ => (),
                    }
                }
                exit = spawn.wait() => {
                    println!("cpp -> exit = {:?}", exit);
                    let exit = match exit {
                        Ok(exit) => exit,
                        Err(e) => {
                            return RunResult::error(self.submission.id, e.to_string());
                        }
                    };

                    exit_status = Some(exit);
                }
                output = stdout.read_buf(&mut stdout_buf) => {
                    println!("cpp -> output = {:?}", output);
                    let output = match output {
                        Ok(output) => output,
                        Err(e) => {
                            return RunResult::error(self.submission.id, e.to_string());
                        }
                    };

                    if output == 0 {
                        if exit_status.is_some() {
                            break;
                        }

                        continue;
                    }

                    for i in (0..stdout_buf.len() + 1).rev() {
                        match String::from_utf8(stdout_buf.iter().take(i).map(|b| *b).collect()) {
                            Ok(s) => {
                                tx.send(crate::Control {
                                    cmd_id: None,
                                    job_id: self.submission.id,
                                    data: crate::ControlType::Output(s),
                                });
                                stdout_buf.advance(i);
                                break;
                            }
                            Err(_) => (),
                        }
                    }
                }
                output = stderr.read_buf(&mut stderr_buf) => {
                    println!("cpp -> stderr = {:?}", output);
                    let output = match output {
                        Ok(output) => output,
                        Err(e) => {
                            return RunResult::error(self.submission.id, e.to_string());
                        }
                    };

                    if output == 0 {
                        if exit_status.is_some() {
                            break;
                        }

                        continue;
                    }

                    for i in (0..stderr_buf.len() + 1).rev() {
                        match String::from_utf8(stderr_buf.iter().take(i).map(|b| *b).collect()) {
                            Ok(s) => {
                                tx.send(crate::Control {
                                    cmd_id: None,
                                    job_id: self.submission.id,
                                    data: crate::ControlType::Output(s),
                                });
                                stderr_buf.advance(i);
                                break;
                            }
                            Err(_) => (),
                        }
                    }
                }
            }
        }

        if let Some(exit) = exit_status {
            if let Some(result) = exit
                .signal()
                .and_then(|s| Self::error_from_signal(self.submission.id, s))
            {
                return result;
            }
        }

        return RunResult::output(self.submission.id, "".to_string());
    }
}
