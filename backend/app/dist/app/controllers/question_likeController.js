"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const index_1 = require("../models/index");
const Question_like = index_1.db.Question_like;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
const userController_1 = require("./userController");
const QuestionController_1 = require("./QuestionController");
const fcmController_1 = require("./fcmController");
exports.findAll = async (req, res) => {
    /* #swagger.tags = ['question_like']*/
    try {
        const findall = await Question_like.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['question_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const question_like = {
            question_id: req.body.questionId,
            user_id: userData.no
        };
        const questionData = await (0, QuestionController_1.checkQuestion)(req.body.questionId).catch(err => { throw new Error(err); });
        if (questionData) {
            const question_likeData = await Question_like.findOne({ where: question_like, transaction: transaction })
                .catch(err => { throw new Error(err); });
            if (question_likeData) {
                const updateData = await Question_like.update({ state: 1 }, { where: question_like, transaction: transaction })
                    .catch(err => { throw new Error(err); });
                if (updateData == 0)
                    throw new Error("nothing changed");
            }
            else {
                await Question_like.create(question_like, { transaction }).catch(err => { throw new Error(err); });
            }
            await (0, QuestionController_1.updateQuestionLike)(req.body.questionId, 1, transaction).catch(err => { throw new Error(err); });
            await transaction.commit();
            await (0, fcmController_1.pushMessage)(questionData.user_id, "Ju Coding", "Your question has been liked.").catch(err => { throw new Error(err); });
            return res.send("success");
        }
        else
            throw new Error("no such question");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else if (err.message === "no such question")
            return (0, err_config_1.errConfig)(res, null, "no such question");
        else
            return (0, err_config_1.errConfig)(res, err, "question_like create");
    }
};
exports.cancel = async (req, res) => {
    //  #swagger.tags = ['question_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const question_like = {
            question_id: req.body.questionId,
            user_id: userData.no
        };
        const question_likeData = await Question_like.findOne({ where: question_like, transaction: transaction })
            .catch(err => { throw new Error(err); });
        if (question_likeData) {
            const updateData = await Question_like.update({ state: 0 }, { where: question_like, transaction: transaction })
                .catch(err => { throw new Error(err); });
            if (updateData == 0)
                throw new Error("nothing changed");
            await (0, QuestionController_1.updateQuestionLike)(req.body.questionId, -1, transaction).catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such question_like");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else if (err.message === "no such question_like")
            return (0, err_config_1.errConfig)(res, null, "no such question_like");
        else
            return (0, err_config_1.errConfig)(res, err, "question_like cancel");
    }
};
exports.checking = (req, res) => {
    //  #swagger.tags = ['question_like']
    (0, userController_1.userCheck)(req).then(data => {
        const question_like = {
            question_id: req.params.questionId,
            user_id: data.no,
            state: 1
        };
        Question_like.findOne({ where: question_like }).then((data) => {
            if (data)
                return res.send(true);
            else
                return res.send(false);
        }).catch(err => { return (0, err_config_1.errConfig)(res, err, "question_like checking - findOne"); });
    }).catch(err => {
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "question_like checking - userCheck");
    });
};
//# sourceMappingURL=question_likeController.js.map