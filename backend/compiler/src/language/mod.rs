
pub mod cpp;

use std::future::Future;

pub use cpp::CPlusPlus;

#[derive(Debug)]

pub struct Submission{
    pub id : u64,
    pub language : String,
    pub code : String,
    pub status_update : mysql_async::Value,
}
impl Submission {
    pub fn new(
        id : u64,
        language : String,
        code : String,
        status_update : mysql_async::Value,
    ) -> Self{
        Self{
            id,
            language,
            code,
            status_update,
        }
    }
}

#[derive(Debug)]
pub struct RunResult{
    pub id : u64,
    pub result : Result<String, String>
}
impl RunResult {
    pub fn error(id : u64, error : String) -> Self{
        Self{
            id,
            result : Err(error),
        }
    }
    pub fn output(id: u64, output : String) -> Self{
        Self{
            id,
            result : Ok(output),
        }
    }
}

pub trait Language {
    fn new(submission: Submission) -> Self;
    fn get_no(&self) -> u64;
    fn error_from_signal(job_id: u64, signal: i32) -> Option<RunResult>{
        match signal{
            3=>{
                return Some(RunResult::error(job_id, "SIGQUIT".to_string()));
            }
            4=>{
                return Some(RunResult::error(job_id, "SIGILL".to_string()));
            }
            5=>{
                return Some(RunResult::error(job_id, "SIGTRAP".to_string()));
            }
            6=>{
                return Some(RunResult::error(job_id, "SIGABRT".to_string()));
            }
            7=>{
                return Some(RunResult::error(job_id, "SIGBUS".to_string()));
            }
            8=>{
                return Some(RunResult::error(job_id, "SIGFPE".to_string()));
            }
            9=>{
                return Some(RunResult::error(job_id, "SIGKILL".to_string()));
            }
            10=>{
                return Some(RunResult::error(job_id, "SIGUSR1".to_string()));
            }
            11=>{
                return Some(RunResult::error(job_id, "SIGSEGV".to_string()));
            }
            13 => {
                return Some(RunResult::error(job_id, "SIGPIPE".to_string()));
            }
            16 => {
                return Some(RunResult::error(job_id, "SIGSTKFLT".to_string()));
            }
            24 => {
                return Some(RunResult::error(job_id, "SIGXCPU".to_string()));
            }
            _=> return None,

        }
    }
}