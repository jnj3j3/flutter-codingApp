require("dotenv").config();
import {db,QuestionReq} from '../models/index';
const Question = db.Question;
const sequelize = db.sequelize;
import { errConfig } from '../config/err.config';
import e, {Request, Response} from 'express';
import { userFindOne ,userCheck} from './userController';
const Op = db.Sequelize.Op;
import { create_word,delete_word,search } from './searchController';
import { Transaction } from 'sequelize';
import { print } from 'ioredis';
exports.findAll = async (req: Request, res: Response) => {
    /*  #swagger.tags = ['question']
    */
        try{
        const findall = await Question.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};

exports.pageNation = async (req: Request, res: Response) => {
    // #swagger.tags = ['question']
    try{
        const page:number = parseInt(req.params.page)*10;
        const order:string = req.params.order;
        const isDesc:string = req.params.isDesc===" "?"DESC":"ASC";
        const searchSentence:string = req.params.searchSentence;
        var pageData:any;
        var pageCount:number;
        if(searchSentence!==" "){
            var questionArray:Array<any> = [];
            for(let searchData of await search(searchSentence,"question").catch(err=>{throw new Error(err)})){
                const question = await Question.findOne({where:{id:searchData[0],state:1}}).catch(err=>{throw new Error(err)});
                if(question) questionArray.push(question);
            }
            pageCount = questionArray.length;
            pageData = questionArray.slice(page,page+10);
            return res.send({pageCount:pageCount,pageData:pageData});
        }else{
            pageCount = await Question.count({where:{state:1}})
            .catch(err=>{throw new Error(err)});
            if(order===" ") pageData = await Question.findAll({where:{state:1},offset:page,limit:10,order:[["created","DESC"]]})
            .catch(err=>{throw new Error(err)});
            else pageData = await Question.findAll({where:{state:1},offset:page,limit:10,order:[[order,isDesc]]})
            .catch(err=>{throw new Error(err)});
            if(pageCount!=0) pageData = await Promise.all(pageData.map(async (data: any) => {
                const userData = await userFindOne({ no: data.user_id }).catch(err => { throw new Error(err); });
                if (userData) data.user_id = userData.nickname;
                else data.user_id = "탈퇴한 회원";
                return data;
            }));
            return res.send({pageCount:pageCount,pageData:pageData});
        }
    }catch(err){
        return errConfig(res,err,"question pageNation")
    }
}

exports.hotQuestion = async (req: Request, res: Response) => {
    // #swagger.tags = ['question']
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const hotQuestion = await Question.findAll({where:{state:1, like: { [Op.gte]: 5 },created:{[Op.gte]:TODAY_START}}, order:[["like","DESC"]], limit:5})
    .catch(err=>{throw errConfig(res,err,"question hotQuestion")});
    for(var data of hotQuestion){
        const userData = await userFindOne({no:data.user_id}).catch(err=>{throw errConfig(res,err,"question hotQuestion")});
        if(userData) {
            data.user_id = userData.nickname;
        }
        else data.user_id = "탈퇴한 회원";
    }
    return res.send(hotQuestion);
}

exports.findQuestion = async(req: Request, res: Response) => {
    // #swagger.tags = ['question']
    const id = req.params.questionId;
    try{
        const question = await Question.findOne({where: {id: id, state:1}}).catch(err=>{throw new Error(err)});
        if(question){
            const userData = await userFindOne({no:question.user_id}).catch(err=>{throw new Error(err)});
            if(userData) question.user_id = userData.nickname;
            else question.user_id = "탈퇴한 회원";
            await Question.update({views: question.views+1},{where: {id: id}}).catch(err=>{throw new Error(err)});
            return res.send(question);
        }else return errConfig(res,null,"no such question")
    }catch(err){
        return errConfig(res,err,"question findQuestion")
    }
}

exports.create = async (req: Request, res: Response) => {
    //  #swagger.tags = ['question']
    const transaction = await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const no = userData.no;
        const question:QuestionReq = {
            title: req.body.title,
            content: req.body.content,
            user_id: no
        };
        const questionData =  await Question.create(question,{transaction:transaction}).catch((err:any)=>{ throw new Error(err)})
        await create_word([question.title,question.content],questionData.id,"question",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send(questionData);
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else return errConfig(res,err,"question create")
    }
}

exports.update = (req: Request, res: Response) => {
    //  #swagger.tags = ['question']
    const title = req.body.title;
    const content = req.body.content;
    const questionId = req.body.questionId;
    return updateQuestion(req,res,updateFunction);
}

exports.delete = (req: Request, res: Response) => {
    //  #swagger.tags = ['question']
    const questionId = req.body.questionId;
    return updateQuestion(req,res,deleteFunction);
}

const updateFunction =async(req:Request,res:Response,questionId:number,transaction:Transaction)=>{
    try{
        const title = req.body.title;
        const content = req.body.content;
        await Question.update({title: title, content: content},{where: {id: questionId},transaction:transaction})
        .catch(err=>{throw new Error(err)});
        await delete_word(questionId,"question",transaction).catch(err=>{throw new Error(err)});
        await create_word([title,content],questionId,"question",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send("success");
    }catch(err){
        await transaction.rollback();
        return errConfig(res,err,"question update")
    }
}

const deleteFunction =async(req: Request,res: Response,questionId:number,transaction:Transaction)=>{
    try{
        await Question.update({state:0},{where: {id: questionId},transaction:transaction}).catch(err=>{throw new Error(err)});
        await delete_word(questionId,"question",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send("success");
    }catch(err){
        await transaction.rollback();
        return errConfig(res,err,"question delete")
    }
}

const updateQuestion =async(req: Request, res: Response, updateFunction: Function)=>{
    const transaction =await sequelize.transaction();
    try{
        const questionId= req.body.questionId;
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const questionData = await Question.findOne({where:{id:questionId,state:1}}).catch(err=>{throw new Error(err)});
        if(questionData){
            if(questionData.user_id===userData.no){
                return await updateFunction(req, res, questionId,transaction)
            }else throw new Error("no permission")
        }else throw new Error("no such question")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if(err.message==="no such question") return errConfig(res,null,"no such question")
        else if(err.message==="no permission") return errConfig(res,null,"no permission")
        else return errConfig(res,err,"question update")
    }
}

export function checkQuestion(questionId:number):Promise<any>{
    return new Promise((resolve,reject)=>{
        Question.findOne({where:{id:questionId,state:1}}).then((data:any)=>{
            if(data) resolve(data);
            else resolve(false);
        }).catch(err=>{ reject(err)})
    })
}

export function updateQuestionLike(questionId:number,likeVal:number,transaction:Transaction):Promise<any>{
    return new Promise((resolve,reject)=>{
        Question.findOne({where:{id:questionId,state:1},transaction:transaction}).then((data:any)=>{
            if(data||data.like+likeVal>=0){
                Question.update({like: data.like+likeVal},{where: {id: questionId,state:1},transaction:transaction}).then(data=>{
                    resolve(data);
                }).catch(err=>{ reject(err)})
            }
            else reject("no such question or like value is negative");
        }).catch(err=>{ reject(err)})
    })
}

export function updateQuestionClear(questionId:number,clearVal:number,transaction:Transaction):Promise<any>{
    return new Promise((resolve,reject)=>{
        Question.findOne({where:{id:questionId,state:1},transaction:transaction}).then((questionData:any)=>{
            if(questionData.is_clear===clearVal) reject("already clear or canceled")
            else if(questionData){
                Question.update({is_clear:clearVal},{where: {id: questionId,state:1},transaction:transaction}).then(data=>{
                    resolve(questionData);
                }).catch(err=>{ reject(err)})
            }
            else reject("no such question");
        }).catch(err=>{ reject(err)})
    })
}