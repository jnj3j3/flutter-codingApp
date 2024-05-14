require("dotenv").config();
import {db,Code_jobsReq} from '../models/index';
const Code_jobs = db.Code_jobs;
const sequelize = db.sequelize;
import { errConfig } from '../config/err.config';
import e, {Request, Response} from 'express';

exports.findAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['code_jobs']
    try{
        const findall = await Code_jobs.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
}

exports.start = (req: Request, res: Response) => {
    // #swagger.tags = ['code_jobs']
    const code = req.body.code;
    const code_job:Code_jobsReq = {
        language: req.body.langauge,
        code: code,
    };
    Code_jobs.create(code_job).then(async (createData:any)=>{
        const code_jobs_id = createData.id
        var errMessage:String = null;
        while(createData.output === null||createData.output === undefined){
            await sleep(1000)
            Code_jobs.findOne({where: {id: code_jobs_id}}).then(findOneData=>{
                if(findOneData)createData.output= findOneData.output
                else errMessage = "Code_jobs created but can't find it"
            }).catch(err=>{
                errMessage = err
            })
        }
        if(errMessage !== null) return errConfig(res, errMessage,"Code_jobs start findoutput");
        else return res.send(createData)
    }).catch((err:any)=>{ return errConfig(res,err,"code_jobs start create")})
}

function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve,ms))
}

export function code_jobsFindOne(where:Object){
    return new Promise((resolve,reject)=>{
        Code_jobs.findOne(where).then(data=>{
            if(data) resolve(data);
            else resolve(false);
        }).catch(err=>{ reject(err)})
    })
}