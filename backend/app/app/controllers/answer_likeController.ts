require("dotenv").config();
import {db,Answer_likeReq} from '../models/index';
const Answer_like = db.Answer_like;
const sequelize = db.sequelize;
import e, {Request, Response} from 'express';
import { errConfig } from '../config/err.config';
import { userCheck } from './userController';
import { checkAnswer,updateAnswerLike } from './answerController'; 
import { pushMessage } from './fcmController';

exports.findAll = async (req: Request, res: Response) => {
    /* #swagger.tags = ['answer_like']*/
        try{
        const findall = await Answer_like.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};

exports.create = async(req: Request, res: Response) => {
    //  #swagger.tags = ['answer_like']
    const transaction = await sequelize.transaction();
    try{
        const userData  = await userCheck(req).catch(err=>{throw new Error(err)});
        const answer_like:Answer_likeReq = {
            answer_id: req.body.answerId,
            user_id: userData.no
        };
        const answerData = await checkAnswer(req.body.answerId,transaction).catch(err=>{throw new Error(err)});
        if(answerData){
            const answer_likeData = await Answer_like.findOne({where:answer_like as any,transaction:transaction}).catch(err=>{throw new Error(err)});
            if(answer_likeData){
                const updateData = await Answer_like.update({state:1},{where:answer_like as any,transaction:transaction},).catch(err=>{throw new Error(err)});
                if(updateData ==0) throw new Error("nothing changed")
            }else{
                await Answer_like.create(answer_like,{transaction}).catch(err=>{throw new Error(err)});
            }
            await updateAnswerLike(req.body.answerId,1,transaction).catch(err=>{throw new Error(err)});
            await pushMessage(answerData.user_id,"Ju Coding","Your answer has been liked.").catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success")
        }else throw new Error("no such answer")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if (err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else if (err.message==="no such answer") return errConfig(res,null,"no such answer")
        else return errConfig(res,err,"answer_like create")
    }
}

exports.cancel = async (req: Request, res: Response) => {
    //  #swagger.tags = ['answer_like']
    const transaction = await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const answer_like:Answer_likeReq = {
            answer_id: req.body.answerId,
            user_id: userData.no
        };
        const answer_likeData = await Answer_like.findOne({where:answer_like as any,transaction:transaction}).catch(err=>{throw new Error(err)});
        if(answer_likeData){
            const updateData = await Answer_like.update({state:0},{where:answer_like as any,transaction:transaction}).catch(err=>{throw new Error(err)});
            if(updateData ==0) throw new Error("nothing changed")
            const updateAnswerLikeData = await updateAnswerLike(req.body.answerId,-1,transaction).catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success")
        }else throw new Error("no such answer_like")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if (err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else if (err.message==="no such answer_like") return errConfig(res,null,"no such answer_like")
        else return errConfig(res,err,"answer_like cancel")
    }
}

exports.checking = async (req: Request, res: Response) => {
    //  #swagger.tags = ['answer_like']
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const answer_like = {
            answer_id: req.params.answerId,
            user_id: userData.no,
            state:1
        };
        await Answer_like.findOne({where:answer_like as any}).then((data:any)=>{
            if(data) return res.send(true);
            else return res.send(false);
        }).catch(err=>{ throw new Error(err)})
    }catch(err){
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else return errConfig(res,err,"answer_like checking")
    }
}