import {redisClient} from "./redis"

export async function setAsync(key:number, value:string):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try{
            const client = await redisClient();
            const setValue = await client.set(key.toString(),value).catch(err=>{throw new Error(err)});
            resolve(setValue);
        }catch(err){
            reject(err);
        }
    })
}

export async function getAsync(key:number):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try{
            const client = await redisClient();
            const getValue = await client.get(key.toString()).catch(err=>{throw new Error(err)});
            resolve(getValue);
        }catch(err){
            reject(err);
        }
    })
}

export async function delAsync(key:number):Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try{
            const client = await redisClient();
            const delValue = await client.del(key.toString()).catch(err=>{throw new Error(err)});
            resolve(delValue);
        }catch(err){
            reject(err);
        }
    })
}



// export const getAsync = promisify(redisClient.get).bind(redisClient);
// export const setAsync = promisify(redisClient.set).bind(redisClient);
// export const delAsync = promisify(redisClient.del).bind(redisClient);


// const redisClient =async()=>{
//     const client = createRedisClient();
//     client.on("error", err=>{
//         console.log("redis error on" + err);
//     });
//     client.connect();
//     return client;
// };

// export const getAsync = async (key:string) => {
//     const client = await redisClient();
//     return promisify(client.get).bind(client)(key);
// }

// export const setAsync = async (key:string, value:string) => {
//     const client = await redisClient();
//     return promisify(client.set).bind(client)(key, value);
// }

// export const delAsync = async (key:string) => {
//     const client = await redisClient();
//     return promisify(client.del).bind(client)(key);
// }