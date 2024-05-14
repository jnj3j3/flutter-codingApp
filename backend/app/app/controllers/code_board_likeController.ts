require("dotenv").config();
import {db,code_board_likeReq} from '../models/index';
const Code_board_like = db.Code_board_like;
const sequelize = db.sequelize;
import e, {Request, Response} from 'express';
import { errConfig } from '../config/err.config';
import { userCheck } from './userController';
import { checkCode_board,updateCode_boardLike } from './code_boardController';
import { pushMessage } from './fcmController';
exports.findAll = async (req: Request, res: Response) => {
    /* #swagger.tags = ['code_board_like']*/
        try{
        const findall = await Code_board_like.findAll()
        return res.send(findall);
    }
    catch(err){
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};

exports.create =async (req: Request, res: Response) => {
    //  #swagger.tags = ['code_board_like']
    const transaction = await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const code_board_like:code_board_likeReq = {
            code_board_id: req.body.code_boardId,
            user_id: userData.no
        };
        const code_boardData = await checkCode_board(req.body.code_boardId,transaction).catch(err=>{throw new Error(err)});
        if(code_boardData){
            const code_board_likeData = await Code_board_like.findOne({where:code_board_like as any,transaction:transaction})
            .catch(err=>{throw new Error(err)});
            if(code_board_likeData){
                const updateData = await Code_board_like.update({state:1},{where:code_board_like as any,transaction:transaction},)
                .catch(err=>{throw new Error(err)});
                if(updateData ==0) throw new Error("nothing changed")
            }else{
                await Code_board_like.create(code_board_like,{transaction}).catch(err=>{throw new Error(err)});
            }
            await updateCode_boardLike(req.body.code_boardId,1,transaction).catch(err=>{throw new Error(err)});

            await transaction.commit();
            return res.send("success")
        }
        else throw new Error("no such code_board")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if(err.message==="no such code_board") return errConfig(res,null,"no such code_board")
        else if(err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else return errConfig(res,err,"code_board_like create")
    }
}

exports.cancel = async(req: Request, res: Response) => {
    //  #swagger.tags = ['code_board_like']
    const transaction = await sequelize.transaction();
    try{
        const userData = await userCheck(req).catch(err=>{throw new Error(err)});
        const code_board_like:code_board_likeReq = {
            code_board_id: req.body.code_boardId,
            user_id: userData.no,
        };
        const code_board_likeData = await Code_board_like.findOne({where:code_board_like as any,transaction:transaction})
        .catch(err=>{throw new Error(err)});
        if(code_board_likeData){
            const updateData = await Code_board_like.update({state:0},{where:code_board_like as any,transaction:transaction})
            .catch(err=>{throw new Error(err)});
            if(updateData ==0) throw new Error("nothing changed")
            await updateCode_boardLike(req.body.code_boardId,-1,transaction)
            .catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success")
        }else throw new Error("no such code_board_like")
    }catch(err){
        await transaction.rollback();
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else if(err.message==="no such code_board_like") return errConfig(res,null,"no such code_board_like")
        else if(err.message==="nothing changed") return errConfig(res,null,"nothing changed")
        else return errConfig(res,err,"code_board_like cancel")
    } 
}

exports.checking = (req: Request, res: Response) => {
    //  #swagger.tags = ['code_board_like']
    userCheck(req).then(data=>{
        const code_board_like = {
            code_board_id: req.params.code_boardId,
            user_id: data.no,
            state:1
        };
        Code_board_like.findOne({where:code_board_like as any}).then((data:any)=>{
            if(data) return res.send(true);
            else return res.send(false);
        }).catch(err=>{ return errConfig(res,err,"code_board_like checking - findOne")})
    }).catch(err=>{ 
        if(err.message==="not logined") return errConfig(res,null,"not logined")
        else return errConfig(res,err,"code_board_like checking - userCheck")})
}