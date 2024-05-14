"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delAsync = exports.getAsync = exports.setAsync = void 0;
const redis_1 = require("./redis");
async function setAsync(key, value) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await (0, redis_1.redisClient)();
            const setValue = await client.set(key.toString(), value).catch(err => { throw new Error(err); });
            resolve(setValue);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.setAsync = setAsync;
async function getAsync(key) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await (0, redis_1.redisClient)();
            const getValue = await client.get(key.toString()).catch(err => { throw new Error(err); });
            resolve(getValue);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getAsync = getAsync;
async function delAsync(key) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await (0, redis_1.redisClient)();
            const delValue = await client.del(key.toString()).catch(err => { throw new Error(err); });
            resolve(delValue);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.delAsync = delAsync;
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
//# sourceMappingURL=redisUtils.js.map