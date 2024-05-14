require("dotenv").config();
import {db,UserReq} from '../models/index';
import {errConfig} from'../config/err.config';
import crypto from 'crypto';
const User = db.User;
const sequelize = db.sequelize;
type resultType = string|boolean;
const jwtUtils = require('../utils/jwt');
import {Request, Response} from 'express';
import { getAsync,delAsync,setAsync} from '../utils/redisUtils';
import { WhereOptions } from 'sequelize';
const jwt = require('jsonwebtoken');
exports.findAll = async (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    try{
        const findall = await User.findAll()
        return res.send(findall);
    }
    catch(err){
        return errConfig(res,err,"user findAll");
    }
};

exports.create = (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    const password = encryption(req.body.password);
    const user: UserReq = {
        id: req.body.id,
        nickname: req.body.name,
        password: password};
    checkList(User, [{name:"id",value:user.id},
        {name:"nickname",value:user.nickname}]).then((data)=>{
            if(typeof data === "boolean") {
                User.create(user).then((data:any)=>{
                    return res.send("success");
                }).catch((err:any)=>{return errConfig(res,err,"user creating")})
            }
            else return res.send(data);
    }).catch(err=>{return errConfig(res,err,"user create - checking")})
}
exports.checkOne = (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    // const name = req.params.name;
    const name= undefined
    const value = req.params.value;
    checkList(User, [{name:name,value:value}]).then(data=>{
        if(typeof data === "boolean") res.send(true);
        else return res.send(false)
    }).catch(err=>{return errConfig(res,err,"checkOne")})
}
exports.checkJwt = (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    const no = req.body.no;
    const nickname = req.body.nickname;
    if(Boolean(no)&&Boolean(nickname)){
        const Obj ={
            no: no,
            nickname: nickname
        }
        return res.send(Obj)
    }
    else return errConfig(res,null,"not logined")
}

exports.refreshToken =async (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    try{
        const accessToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;
        if(Boolean(accessToken)&&Boolean(refreshToken)){
            const verifyAccess = await jwtUtils.verify(accessToken);
            const decodeAccess = await jwt.decode(accessToken);
            if(decodeAccess!=null&&verifyAccess.message==="jwt expired") {
                const refreshResult = await jwtUtils.refreshVerify(refreshToken,decodeAccess.no).catch(err=>{throw new Error(err)});
                if(refreshResult===true){
                    const newAccessToken = await jwtUtils.sign(decodeAccess);
                    const newRefreshToken = await jwtUtils.refresh();
                    await setAsync(decodeAccess.no,newRefreshToken).catch(err=>{throw new Error(err)});
                    return res.status(200).send({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken
                    })
                }else return errConfig(res,null,"refreshToken is not valid")
            }else{
                return errConfig(res,null,"No authorized or jwt not expired")
            }
        }
    }catch(err){
        return errConfig(res,err,"refreshToken");
    }
}

exports.login =  (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    const id = req.body.id;
    let password = encryption(req.body.password);
    const obj = {
        id: id,
        password: password,
        state: 1
    };
    User.findOne({where:obj}).then(async (data:any)=>{
        if(data) {
            const accessToken = await jwtUtils.sign(data);
            const refreshToken = await jwtUtils.refresh();
            await setAsync(data.no,refreshToken).catch(err=>{throw new Error(err)});
            
            res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken
            })
        }else return errConfig(res,null,"login failed");
    }).catch((err:any)=>{return errConfig(res,err,"user login")});
}


exports.logout=async (req: Request, res: Response)=>{
    //  #swagger.tags = ['user']
    const no = req.body.no;
    try{
        const del = await delAsync(no).catch(err=>{throw new Error(err)});
        return res.send("success");
    }catch(err){
        return errConfig(res,null,"logout failed");
    }

}

exports.delete=async(req: Request, res: Response)=>{
    //  #swagger.tags = ['user']
    const transaction = await sequelize.transaction();
    try{
        const no = req.body.no;
        const password = encryption(req.body.password);
        const userUpdateData = await User.update({state:0},{where:{no:no,password:password,state:1},transaction:transaction})
        .catch(err=>{throw new Error(err)});
        if(userUpdateData==0) return res.send("id or password is wrong")
        else{
            await delAsync(no).catch(err=>{throw new Error(err)});
            await transaction.commit();
            return res.send("success");
        }
    }catch(err){
        await transaction.rollback();
        return errConfig(res,err,"user delete")
    }
}

exports.update=(req: Request, res: Response)=>{
    //  #swagger.tags = ['user']
    // if update nickname give new jwt
    const updateCol = req.body.updateCol;
    var updateValue = req.body.updateValue;
    if(updateCol==="no") return errConfig(res,null,"no cannot be updated.")
    else if(updateCol =="password") 
    updateValue= encryption(updateValue);
    const no = req.body.no;
    const password = encryption(req.body.password);
    User.findOne({where:{no:no,password:password,state:1}}).then((userData:any)=>{
        if(userData){
            User.update({[updateCol]:updateValue},{where:{no:userData.no,state:1}}).then(async (updatedData:any)=>{
                if(updatedData ==0) return res.send("nothing changed")
                else {
                    if(updateCol==="nickname"){
                        const accessToken = jwtUtils.sign({
                            no: updatedData.no,
                            nickname: updateValue
                        });
                        const refreshToken =  jwtUtils.refresh();
                        await setAsync(updatedData.no,refreshToken).catch(err=>{throw new Error(err)});
                        res.status(200).send({
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        })
                    }else{
                        return res.send("success");
                    }
                };
            }).catch((err:any)=>{ return errConfig(res,err,"user update")})
        }else return res.send("id or password is wrong")})
}

exports.findNicknameWithNo = (req: Request, res: Response) => {
    //  #swagger.tags = ['user']
    const no = req.params.no;
    User.findOne({where: {no: no, state:1}}).then(data=>{
        if(data) return res.send({
            nickname: data.nickname,
            created: data.created});
        else return errConfig(res,null,"no such user")
    }).catch(err=>{ return errConfig(res,err,"user findNicknameWithNo")})
}


function checkList(db: any, list: Array<{name:string,value:any}>) :Promise<resultType>{
    return new Promise(async (resolve,reject)=>{
        var existsName: String = null;
        var errMessage: any;
        for (var element of list){
            const name = element.name;
            const value = element.value;
            const obj = {
                [name]: value,
                state: 1
            };
            const data = await db.findOne({ where: obj }).catch((err: any) => {
                errMessage = err;
            });
            if (data !== null) {
                existsName = name;
                break;
            }
        }
        if(existsName) return resolve(existsName+" is already exists");
        else if(errMessage) return reject(errMessage);
        else return resolve(true);
    })
}

function encryption(password: string): string{
    return crypto
        .createHash("sha512")
        .update(password+process.env.SALT)
        .digest("base64");
}

export function userFindOne(whereObj:WhereOptions): Promise<any>{
    return new Promise((resolve,reject)=>{
        User.findOne({where:whereObj}).then((data)=>{
            if(data) return resolve(data);
            else return resolve(false);
        }).catch(err=>{
            return reject(err);
        })
    })
}

export function userCheck(req: Request):Promise<any>{
    return new Promise((resolve,reject)=>{
        const no = req.body.no;
        const nickname = req.body.nickname;
        if(Boolean(no)&&Boolean(nickname)) {
            userFindOne({no: no, state:1}).then(userData=>{
                if(userData){
                    return resolve(userData);
                }else return reject("no such id");
            }).catch(err=>{ return reject(err)})
        }
        else {return reject("not logined")};
    })
}