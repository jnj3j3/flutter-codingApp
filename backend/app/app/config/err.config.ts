import { Response } from "express";

export function errConfig(res: Response, err: any,message : string) : Response {
    if(err != null) console.log(err + " error occured while "+message)
    return res.status(500).send({
        message: " This error occured while "+message
    });
}
