require("dotenv").config();
import {db,question_likeReq} from '../models/index';
const Question_like = db.Question_like;
const sequelize = db.sequelize;
import e, {Request, Response} from 'express';
import { errConfig } from '../config/err.config';
import { userCheck } from './userController';
import { checkQuestion,updateQuestionLike } from './QuestionController';
import { pushMessage } from './fcmController';
exports.findAll = async (req: Request, res: Response) => {
    /* #swagger.tags = ['question_like']*/
        try{
        const findall = await Question_like.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};

exports.create = async(req: Request, res: Response) => {
    //  #swagger.tags = ['question_like']
    const transaction =await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const question_like:question_likeReq = {
            question_id: req.body.questionId,
            user_id: userData.no
        };
        const questionData = await checkQuestion(req.body.questionId).catch(err=>{throw new Error(err)});
        if(questionData){
            const question_likeData = await Question_like.findOne({where:question_like as any,transaction:transaction})
            .catch(err=>{throw new Error(err)});
            if(question_likeData){
                const updateData = await Question_like.update({state:1},{where:question_like as any,transaction:transaction})
                .catch(err=>{throw new Error(err)});
                if(updateData ==0) throw new Error("nothing changed")
            }else{
                await Question_like.create(question_like,{transaction}).catch(err=>{throw new Error(err)});
            }
            await updateQuestionLike(req.body.questionId,1,transaction).catch(err=>{throw new Error(err)});
            await transaction.commit();
            await pushMessage(questionData.user_id,"Ju Coding","Your question has been liked.").catch(err=>{throw new Error(err)});
            return res.send("success")
        }else throw new Error("no such question")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if (err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else if (err.message==="no such question") return errConfig(res,null,"no such question")
        else return errConfig(res,err,"question_like create")
    }
}

exports.cancel = async(req: Request, res: Response) => {
    //  #swagger.tags = ['question_like']
    const transaction = await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const question_like:question_likeReq = {
            question_id: req.body.questionId,
            user_id: userData.no
        };
        const question_likeData = await Question_like.findOne({where:question_like as any,transaction:transaction})
        .catch(err=>{throw new Error(err)});
        if(question_likeData){
            const updateData = await Question_like.update({state:0},{where:question_like as any,transaction:transaction})
            .catch(err=>{throw new Error(err)});
            if(updateData ==0) throw new Error("nothing changed")
            await updateQuestionLike(req.body.questionId,-1,transaction).catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success")
        }else throw new Error("no such question_like")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if (err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else if (err.message==="no such question_like") return errConfig(res,null,"no such question_like")
        else return errConfig(res,err,"question_like cancel")
    }
}

exports.checking = (req: Request, res: Response) => {
    //  #swagger.tags = ['question_like']
    userCheck(req).then(data=>{
        const question_like = {
            question_id: req.params.questionId,
            user_id: data.no,
            state:1
        };
        Question_like.findOne({where:question_like as any}).then((data:any)=>{
            if(data) return res.send(true);
            else return res.send(false);
        }).catch(err=>{ return errConfig(res,err,"question_like checking - findOne")})
    }).catch(err=>{ 
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else return errConfig(res,err,"question_like checking - userCheck")})
}