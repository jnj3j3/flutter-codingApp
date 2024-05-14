"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const index_1 = require("../models/index");
const Answer_like = index_1.db.Answer_like;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
const userController_1 = require("./userController");
const answerController_1 = require("./answerController");
const fcmController_1 = require("./fcmController");
exports.findAll = async (req, res) => {
    /* #swagger.tags = ['answer_like']*/
    try {
        const findall = await Answer_like.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['answer_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const answer_like = {
            answer_id: req.body.answerId,
            user_id: userData.no
        };
        const answerData = await (0, answerController_1.checkAnswer)(req.body.answerId, transaction).catch(err => { throw new Error(err); });
        if (answerData) {
            const answer_likeData = await Answer_like.findOne({ where: answer_like, transaction: transaction }).catch(err => { throw new Error(err); });
            if (answer_likeData) {
                const updateData = await Answer_like.update({ state: 1 }, { where: answer_like, transaction: transaction }).catch(err => { throw new Error(err); });
                if (updateData == 0)
                    throw new Error("nothing changed");
            }
            else {
                await Answer_like.create(answer_like, { transaction }).catch(err => { throw new Error(err); });
            }
            await (0, answerController_1.updateAnswerLike)(req.body.answerId, 1, transaction).catch(err => { throw new Error(err); });
            await (0, fcmController_1.pushMessage)(answerData.user_id, "Ju Coding", "Your answer has been liked.").catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such answer");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else if (err.message === "no such answer")
            return (0, err_config_1.errConfig)(res, null, "no such answer");
        else
            return (0, err_config_1.errConfig)(res, err, "answer_like create");
    }
};
exports.cancel = async (req, res) => {
    //  #swagger.tags = ['answer_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const answer_like = {
            answer_id: req.body.answerId,
            user_id: userData.no
        };
        const answer_likeData = await Answer_like.findOne({ where: answer_like, transaction: transaction }).catch(err => { throw new Error(err); });
        if (answer_likeData) {
            const updateData = await Answer_like.update({ state: 0 }, { where: answer_like, transaction: transaction }).catch(err => { throw new Error(err); });
            if (updateData == 0)
                throw new Error("nothing changed");
            const updateAnswerLikeData = await (0, answerController_1.updateAnswerLike)(req.body.answerId, -1, transaction).catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such answer_like");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else if (err.message === "no such answer_like")
            return (0, err_config_1.errConfig)(res, null, "no such answer_like");
        else
            return (0, err_config_1.errConfig)(res, err, "answer_like cancel");
    }
};
exports.checking = async (req, res) => {
    //  #swagger.tags = ['answer_like']
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const answer_like = {
            answer_id: req.params.answerId,
            user_id: userData.no,
            state: 1
        };
        await Answer_like.findOne({ where: answer_like }).then((data) => {
            if (data)
                return res.send(true);
            else
                return res.send(false);
        }).catch(err => { throw new Error(err); });
    }
    catch (err) {
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "answer_like checking");
    }
};
//# sourceMappingURL=answer_likeController.js.map