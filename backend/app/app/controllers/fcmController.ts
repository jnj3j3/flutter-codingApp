require("dotenv").config();
import {db} from '../models/index';
import { errConfig } from '../config/err.config';
import e, {Request, Response} from 'express';
const moment = require('moment');
import { DATE } from 'sequelize';
import {admin} from '../utils/FCMadmin';
const FCM = db.FCM;
const sequelize = db.sequelize;

exports.findAll = async (req: Request, res: Response) => {
    // #swagger.tags = ['fcm']
    try{
        const findall = await FCM.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
}

exports.create = (req: Request, res: Response) => {
    // #swagger.tags = ['fcm']
    console.log(req.body);
    const token = req.body.token;
    const user_id = req.body.no;
    const fcm = {
        token: token,
        user_id: user_id,
    };
    FCM.findAll({where:{user_id:fcm.user_id,token:token}}).then((FCMdata:any)=>{
        if(FCMdata.length!==0) {
            const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
            const create = moment().format(DATE_TIME_FORMAT);
            FCM.update({created:create},{where:{user_id:user_id,token:token}}).then((data:any)=>{
                return res.send("success");
            }).catch((err:any)=>{return errConfig(res,err,"fcm updating")})
        }else {
            FCM.create(fcm).then((data:any)=>{
                return res.send("success");
            }).catch((err:any)=>{return errConfig(res,err,"fcm creating")})
        }
    })
}

export function pushMessage(userId:number, title:string, body:string):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        FCM.findAll({where:{user_id:userId}}).then((FCMdata:Array<any>)=>{
            if(FCMdata.length===0) reject("no token");
            else {
                const message={
                    notification:{
                        title:title,
                        body:body
                    },
                    tokens:FCMdata.map((data:any)=>{return data.token})
                }
                admin.messaging().sendMulticast(message).then((response:any)=>{
                    resolve(response)
                }).catch((error:any)=>{
                    reject(error)
                })
            }
        }).catch(err=>{reject(err)})
    })
}
