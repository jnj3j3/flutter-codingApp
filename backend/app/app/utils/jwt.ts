const jwt = require('jsonwebtoken');
import {delAsync,getAsync, setAsync} from './redisUtils';
require('dotenv').config();
const crypto = require('crypto');
const utils = require('util');
module.exports = {
  sign: (user) => { // create access token
    const payload = {
        no: user.no,
        nickname: user.nickname
    };
    return jwt.sign(payload,process.env.JWT_SECRET_KEY , { 
      algorithm: 'HS256', 
      expiresIn: '60m', 	  
    });
  },
  verify: async (token) => { // check access token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if(!decoded.no || !decoded.nickname) throw new Error("no such user");
      const data = await getAsync(decoded.no);
      if (data  === null) {
        throw new Error("no such user refreshToken");
      }
      return {
        ok: true,
        no: decoded.no,
        nickname: decoded.nickname,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => { // check refresh token
    const payload={
      refresh: crypto.randomBytes(40).toString('hex'),
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { 
      algorithm: 'HS256',
      expiresIn: '14d',
    });
    },
    refreshVerify: async (token, userId) => { // check refresh token
        try {
            const data = await getAsync(userId);
            if (data  === null) {
              throw new Error("no such user refreshToken"); 
            }else if(data !== token){
              const del = await delAsync(userId);
              throw new Error("refreshToken is not same");
            }
            return true;
        }catch (err) {
            return false;
        }
    },
};