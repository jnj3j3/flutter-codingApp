require("dotenv").config();
import {db,Code_boardReq,Code_boardUpdate} from '../models/index';
const Code_board = db.Code_board;
const sequelize = db.sequelize;
import {userCheck, userFindOne} from './userController';
import { code_jobsFindOne } from './code_jobsController';
import { errConfig } from '../config/err.config';
import e, {Request, Response} from 'express';
import { Transaction } from 'sequelize';
import { create_word, delete_word, search } from './searchController';
const Op = db.Sequelize.Op;
exports.findAll = async (req: Request, res: Response) => {
    /*  #swagger.tags = ['code_board']
    */
        try{
        const findall = await Code_board.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};

exports.findBoard = async(req: Request, res: Response) => {
    // #swagger.tags = ['code_board']
    const id = req.params.boardId;
    try{
        const codeBoard = await Code_board.findOne({where: {id: id, state:1}}).catch(err=>{throw new Error(err)});
        if(codeBoard != null){
            const userData = await userFindOne({where:{no:codeBoard.user_id}}).catch(err=>{throw new Error(err)});
            if(userData) codeBoard.user_id = userData.nickname;
            else codeBoard.user_id = "탈퇴한 회원"; //user_id is not id but nickname
            return res.send(codeBoard);
        }
    }catch(err){
        return errConfig(res,err,"code_board findBoard")
    }
}

exports.hotBoard = async (req: Request, res: Response) => {
    // #swagger.tags = ['code_board']
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const hotBoard = await Code_board.findAll({where:{state:1, like: { [Op.gte]: 5 },created:{[Op.gte]:TODAY_START}}, order:[["like","DESC"]], limit:5})
    .catch(err=>{throw errConfig(res,err,"code_board hotBoard")});
    for(var data of hotBoard){
        const userData = await userFindOne({no:data.user_id}).catch(err=>{throw new Error(err)});
        if(userData) data.user_id = userData.nickname;
        else data.user_id = "탈퇴한 회원";
    }
    return res.send(hotBoard);
}

exports.pageNation = async (req: Request, res: Response) => {
    // #swagger.tags = ['code_board']
    try{
        const page:number = parseInt(req.params.page)*10;
        const order:string = req.params.order;
        const isDesc:string = req.params.isDesc==="true"?"DESC":"ASC";
        const language:string = req.params.language;
        const searchSentence:string = req.params.searchSentence;
        var pageCount:number;
        var pageData:any;
        if(searchSentence===" "){
            var code_boardArray:Array<any> = [];
            for(let searchData of await search(searchSentence,"code_board").catch(err=>{throw new Error(err)})){
                const code_board = language===" "? await Code_board.findOne({where:{id:searchData[0],state:1}})
                .catch(err=>{throw new Error(err)})
                :await Code_board.findOne({where:{id:searchData[0],state:1,language:language}}).catch(err=>{throw new Error(err)});
                if(code_board) code_boardArray.push(code_board);
            }
            pageCount = code_boardArray.length;
            pageData = code_boardArray.slice(page,page+10);
            if(pageCount !=0) pageData = await Promise.all(pageData.map(async(data:any)=>{
                const userData = await userFindOne({where:{no:data.user_id}}).catch(err=>{throw new Error(err)});
                if(userData) data.user_id = userData.nickname;
                else data.user_id = "탈퇴한 회원";
            }));
            return res.send({pageCount:pageCount,pageData:pageData});
        }else{
            pageCount =language===" "? await Code_board.count({where:{state:1}})
            .catch(err=>{throw new Error(err)})
            : await Code_board.count({where:{state:1,language:language}}).catch(err=>{throw new Error(err)});
            pageData =language===" "? await Code_board.findAll({where:{state:1},offset:page*10,limit:10,order:[order,isDesc]})
            .catch(err=>{throw new Error(err)})
            :await Code_board.findAll({where:{state:1,language:language},offset:page*10,limit:10,order:[order,isDesc]})
            .catch(err=>{throw new Error(err)});
        }
        return res.send({pageCount:pageCount,pageData:pageData});
    }catch(err){
        return errConfig(res,err,"code_board pageNation")
    }
}


exports.create = async (req: Request, res: Response) => {
    //  #swagger.tags = ['code_board']
    const transaction = await sequelize.transaction();
    try{
        const userData  = await userCheck(req).catch(err=>{throw new Error(err)});
        const code = req.body.code;
        const code_job:Code_boardReq = { 
            title: req.body.title,
            language: req.body.langauge,
            code: code,
            user_id: userData.no
        };
        const code_boardData = await Code_board.create(code_job,{transaction}).catch(err=>{throw new Error(err)});
        await create_word([code_boardData.title],code_boardData.id,"code_board",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send(code_boardData);
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else return errConfig(res,err,"code_board create")
    }
}

exports.update = (req: Request, res: Response) => {
    //  #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    const code = req.body.code;
    const language = req.body.langauge  // wrote these variable for swagger so later i must delete these
    return updateBoard(req, res, updateFunction)
}

exports.delete = (req: Request, res: Response) => {
    //  #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    return updateBoard(req, res, deleteFunction)
}

exports.saveOutput = (req: Request, res: Response)=>{
    // #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    const code_jobs_id = req.body.code_jobs_id
    return updateBoard(req, res, comebineToJobs)
}

const updateFunction = async(req: Request,res: Response,boardId:number,transaction:Transaction)=>{
    try{
        const code = req.body.code;
        const code_job:Code_boardUpdate = {
            title: req.body.title,
            language: req.body.langauge,
            code: code
        };
        await Code_board.update(code_job,{where:{id:boardId,state:1},transaction:transaction}).catch(err=>{throw new Error(err)});
        await delete_word(boardId,"code_board",transaction).catch(err=>{throw new Error(err)});
        await create_word([code_job.title],boardId,"code_board",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send("success");
    }catch(err){
        await transaction.rollback();
        return errConfig(res,err,"code_board update")
    }
}

const deleteFunction =async (req: Request,res: Response,boardId:number,transaction:Transaction)=>{
    try{
        await Code_board.update({state:0},{where:{id:boardId,state:1},transaction:transaction}).catch(err=>{throw new Error(err)});
        await delete_word(boardId,"code_board",transaction).catch(err=>{throw new Error(err)});
        await transaction.commit();
        return res.send("success");
    }catch(err){
        await transaction.rollback();
        return errConfig(res,err,"code_board delete")
    }
}

const comebineToJobs = async(req: Request,res: Response,boardId:number,transaction:Transaction)=>{
    try{
        const code_jobs_id = req.body.code_jobs_id;
        const code_jobsData = await code_jobsFindOne({where:{id:code_jobs_id},transaction:transaction})
        .catch(err=>{throw new Error(err)});
        if(code_jobsData){
            await Code_board.update({code_jobs_id:code_jobs_id},{where:{id:boardId,state:1},transaction:transaction})
            .catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success");
        }else throw new Error("no such code_jobs")
    }catch(err){
        await transaction.rollback();
        if(err.message==="no such code_jobs") return errConfig(res,null,"no such code_jobs")
        else return errConfig(res,err,"code_board combineToJobs")
    }
}

const updateBoard =async (req: Request, res: Response, updateFunction: Function)=>{
    const transaction = await sequelize.transaction();
    try{
        const boardId= req.body.boardId;
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const code_boardData = await Code_board.findOne({where:{id:boardId,state:1},transaction:transaction})
        .catch(err=>{throw new Error(err)});
        if(code_boardData){
            if(code_boardData.user_id===userData.no){
                return await updateFunction(req, res, boardId,transaction)
            }else throw new Error("no permission")
        }else throw new Error("no such board")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if(err.message==="no such board") return errConfig(res,null,"no such board")
        else return errConfig(res,err,"code_board update")
    }
}

export function checkCode_board(boardId:number,transaction:Transaction):Promise<any> {
    return new Promise((resolve,reject)=>{
        Code_board.findOne({where:{id:boardId,state:1},transaction:transaction}).then((data:any)=>{
            if(data) resolve(data);
            else resolve(false);
        }).catch(err=>{ reject(err)})
    })
}

export function updateCode_boardLike(code_boardId:number,likeVal:number,transaction:Transaction):Promise<any>{
    return new Promise((resolve,reject)=>{
        Code_board.findOne({where:{id:code_boardId,state:1},transaction:transaction}).then((data:any)=>{
            if(data||data.like+likeVal>=0){
                Code_board.update({like: data.like+likeVal},{where: {id: code_boardId,state:1},transaction:transaction}).then(data=>{
                    resolve(data);
                }).catch(err=>{ reject(err)})
            }
            else reject("no such code_board or like value is negative");
        }).catch(err=>{ reject(err)})
    })
}