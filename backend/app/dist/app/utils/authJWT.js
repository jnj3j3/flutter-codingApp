"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { verify } = require('./jwt');
const util = require('util');
const authJWT = async (req, res, next) => {
    if (Boolean(req.headers.authorization)) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = await verify(token);
        console.log(util.inspect(result, false, null, true /* enable colors */));
        if (result.ok) {
            req.body.no = result.no;
            req.body.nickname = result.nickname;
            next();
        }
        else {
            res.status(401).send({
                message: result.message,
            });
        }
    }
};
module.exports = authJWT;
//# sourceMappingURL=authJWT.js.map