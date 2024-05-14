"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = async () => {
    const client = await (0, redis_1.createClient)({
        socket: {
            host: 'redis_container',
            rejectUnauthorized: true
        }
    });
    client.on("error", err => {
        console.log("redis error on" + err);
    });
    await client.connect();
    return client;
};
exports.redisClient = redisClient;
// redisClient.on('connect', () => {
//     console.log('Connected to Redis12345');
// })
// redisClient.on('error', (err) => {
//     console.log(err.message);
// })
// redisClient.on('ready', () => {
//     console.log('Redis is ready');
// })
// redisClient.on('end', () => {
//     console.log('Redis connection ended');
// })
// redisClient.on('SIGINT', () => {
//     redisClient.quit();
// })
// redisClient.connect().then(() => {
//     console.log('Connected to Redis');
// }).catch((err) => {
//     console.log(err.message);
// })
//# sourceMappingURL=redis.js.map