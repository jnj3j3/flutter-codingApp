"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const redisUtils_1 = require("./redisUtils");
require('dotenv').config();
const crypto = require('crypto');
const utils = require('util');
module.exports = {
    sign: (user) => {
        const payload = {
            no: user.no,
            nickname: user.nickname
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '60m',
        });
    },
    verify: async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decoded.no || !decoded.nickname)
                throw new Error("no such user");
            const data = await (0, redisUtils_1.getAsync)(decoded.no);
            if (data === null) {
                throw new Error("no such user refreshToken");
            }
            return {
                ok: true,
                no: decoded.no,
                nickname: decoded.nickname,
            };
        }
        catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        const payload = {
            refresh: crypto.randomBytes(40).toString('hex'),
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },
    refreshVerify: async (token, userId) => {
        try {
            const data = await (0, redisUtils_1.getAsync)(userId);
            if (data === null) {
                throw new Error("no such user refreshToken");
            }
            else if (data !== token) {
                const del = await (0, redisUtils_1.delAsync)(userId);
                throw new Error("refreshToken is not same");
            }
            return true;
        }
        catch (err) {
            return false;
        }
    },
};
//# sourceMappingURL=jwt.js.map