"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushMessage = void 0;
require("dotenv").config();
const index_1 = require("../models/index");
const err_config_1 = require("../config/err.config");
const moment = require('moment');
const FCMadmin_1 = require("../utils/FCMadmin");
const FCM = index_1.db.FCM;
const sequelize = index_1.db.sequelize;
exports.findAll = async (req, res) => {
    // #swagger.tags = ['fcm']
    try {
        const findall = await FCM.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.create = (req, res) => {
    // #swagger.tags = ['fcm']
    console.log(req.body);
    const token = req.body.token;
    const user_id = req.body.no;
    const fcm = {
        token: token,
        user_id: user_id,
    };
    FCM.findAll({ where: { user_id: fcm.user_id, token: token } }).then((FCMdata) => {
        if (FCMdata.length !== 0) {
            const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
            const create = moment().format(DATE_TIME_FORMAT);
            FCM.update({ created: create }, { where: { user_id: user_id, token: token } }).then((data) => {
                return res.send("success");
            }).catch((err) => { return (0, err_config_1.errConfig)(res, err, "fcm updating"); });
        }
        else {
            FCM.create(fcm).then((data) => {
                return res.send("success");
            }).catch((err) => { return (0, err_config_1.errConfig)(res, err, "fcm creating"); });
        }
    });
};
function pushMessage(userId, title, body) {
    return new Promise(async (resolve, reject) => {
        FCM.findAll({ where: { user_id: userId } }).then((FCMdata) => {
            if (FCMdata.length === 0)
                reject("no token");
            else {
                const message = {
                    notification: {
                        title: title,
                        body: body
                    },
                    tokens: FCMdata.map((data) => { return data.token; })
                };
                FCMadmin_1.admin.messaging().sendMulticast(message).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
            }
        }).catch(err => { reject(err); });
    });
}
exports.pushMessage = pushMessage;
//# sourceMappingURL=fcmController.js.map