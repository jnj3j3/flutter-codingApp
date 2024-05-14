"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnswerLike = exports.checkAnswer = void 0;
require("dotenv").config();
const index_1 = require("../models/index");
const Answer = index_1.db.Answer;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
const userController_1 = require("./userController");
const QuestionController_1 = require("./QuestionController");
const userController_2 = require("./userController");
const fcmController_1 = require("./fcmController");
exports.findAll = async (req, res) => {
    //  #swagger.tags = ['answer']
    try {
        const findall = await Answer.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.pageNation = async (req, res) => {
    //  #swagger.tags = ['answer']
    try {
        const page = parseInt(req.params.page);
        const parentId = parseInt(req.params.parentId);
        const pageCount = await Answer.count({ where: { state: 1, parent_id: parentId } })
            .catch(err => { throw new Error(err); });
        var pageData = await Answer.findAll({ where: { state: 1, parent_id: parentId },
            offset: page * 10, limit: 10, order: [["is_selected", "DESC"], ["created", "DESC"]] })
            .catch(err => { throw new Error(err); });
        if (pageData.length != 0)
            pageData = await Promise.all(pageData.map(async (data) => {
                const userData = await (0, userController_2.userFindOne)({ no: data.user_id }).catch(err => { throw new Error(err); });
                if (userData)
                    data.user_id = userData.nickname;
                else
                    data.user_id = "탈퇴한 회원";
                return data;
            }));
        return res.send({ pageCount: pageCount, pageData: pageData });
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "answer pageNation");
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['answer']
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const answer = {
            content: req.body.content,
            user_id: userData.no,
            parent_id: req.body.answerId
        };
        const answerData = await Answer.create(answer).catch(err => { throw new Error(err); });
        return res.send(answerData);
    }
    catch (err) {
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "answer create");
    }
};
exports.update = (req, res) => {
    //  #swagger.tags = ['answer']
    const content = req.body.content;
    const answerId = req.body.answerId;
    return updateAnswer(req, res, updateFunction);
};
exports.delete = (req, res) => {
    //  #swagger.tags = ['answer']
    const answerId = req.body.answerId;
    return updateAnswer(req, res, deleteFunction);
};
exports.select = (req, res) => {
    //  #swagger.tags = ['answer']
    const answerId = req.body.answerId;
    const questionId = req.body.questionId;
    return updateAnswer(req, res, selectFunction);
};
const selectFunction = async (req, res, answerId, transaction) => {
    try {
        const questionId = req.body.questionId;
        const questionData = await (0, QuestionController_1.updateQuestionClear)(questionId, 1, transaction).catch(err => { throw new Error(err); });
        await Answer.update({ is_selected: 1 }, { where: { id: answerId, state: 1 }, transaction: transaction })
            .catch(err => { throw new Error(err); });
        const answerData = await Answer.findOne({ where: { id: answerId, state: 1 }, transaction: transaction }).catch(err => { throw new Error(err); });
        await transaction.commit();
        await (0, fcmController_1.pushMessage)(answerData.user_id, "Ju Coding", "Your answer has been selected").catch(err => { throw new Error(err); });
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "already clear or canceled")
            return (0, err_config_1.errConfig)(res, null, "already clear or canceled");
        return (0, err_config_1.errConfig)(res, err, "answer select");
    }
};
const updateFunction = async (req, res, answerId, transaction) => {
    try {
        const content = req.body.content;
        await Answer.update({ content: content }, { where: { id: answerId }, transaction: transaction }).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "answer update");
    }
};
const deleteFunction = async (req, res, answerId, transaction) => {
    try {
        await Answer.update({ state: 0 }, { where: { id: answerId }, transaction: transaction }).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "answer delete");
    }
};
const updateAnswer = async (req, res, updateFunction) => {
    const transaction = await sequelize.transaction();
    const answerId = req.body.answerId;
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const answerData = await Answer.findOne({ where: { id: answerId, state: 1 }, transaction: transaction }).catch(err => { throw new Error(err); });
        if (answerData) {
            if (answerData.user_id === userData.no) {
                return await updateFunction(req, res, answerId, transaction);
            }
            else
                throw new Error("no permission");
        }
        else
            throw new Error("no such answer");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "no permission")
            return (0, err_config_1.errConfig)(res, null, "no permission");
        else if (err.message === "no such answer")
            return (0, err_config_1.errConfig)(res, null, "no such answer");
        else
            return (0, err_config_1.errConfig)(res, err, "answer update");
    }
};
function checkAnswer(answerId, transaction) {
    return new Promise((resolve, reject) => {
        Answer.findOne({ where: { id: answerId, state: 1 }, transaction: transaction }).then((data) => {
            if (data)
                resolve(data);
            else
                resolve(false);
        }).catch(err => { reject(err); });
    });
}
exports.checkAnswer = checkAnswer;
function updateAnswerLike(answerId, likeVal, transaction) {
    return new Promise((resolve, reject) => {
        Answer.findOne({ where: { id: answerId, state: 1 } }).then((data) => {
            if (data || data.like + likeVal >= 0) {
                Answer.update({ like: data.like + likeVal }, { where: { id: answerId, state: 1 }, transaction: transaction }).then(data => {
                    resolve(data);
                }).catch(err => { reject(err); });
            }
            else
                reject("no such answer or like value is negative");
        }).catch(err => { reject(err); });
    });
}
exports.updateAnswerLike = updateAnswerLike;
//# sourceMappingURL=answerController.js.map