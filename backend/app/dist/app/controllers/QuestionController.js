"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuestionClear = exports.updateQuestionLike = exports.checkQuestion = void 0;
require("dotenv").config();
const index_1 = require("../models/index");
const Question = index_1.db.Question;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
const userController_1 = require("./userController");
const Op = index_1.db.Sequelize.Op;
const searchController_1 = require("./searchController");
exports.findAll = async (req, res) => {
    /*  #swagger.tags = ['question']
    */
    try {
        const findall = await Question.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.pageNation = async (req, res) => {
    // #swagger.tags = ['question']
    try {
        const page = parseInt(req.params.page) * 10;
        const order = req.params.order;
        const isDesc = req.params.isDesc === " " ? "DESC" : "ASC";
        const searchSentence = req.params.searchSentence;
        var pageData;
        var pageCount;
        if (searchSentence !== " ") {
            var questionArray = [];
            for (let searchData of await (0, searchController_1.search)(searchSentence, "question").catch(err => { throw new Error(err); })) {
                const question = await Question.findOne({ where: { id: searchData[0], state: 1 } }).catch(err => { throw new Error(err); });
                if (question)
                    questionArray.push(question);
            }
            pageCount = questionArray.length;
            pageData = questionArray.slice(page, page + 10);
            return res.send({ pageCount: pageCount, pageData: pageData });
        }
        else {
            pageCount = await Question.count({ where: { state: 1 } })
                .catch(err => { throw new Error(err); });
            if (order === " ")
                pageData = await Question.findAll({ where: { state: 1 }, offset: page, limit: 10, order: [["created", "DESC"]] })
                    .catch(err => { throw new Error(err); });
            else
                pageData = await Question.findAll({ where: { state: 1 }, offset: page, limit: 10, order: [[order, isDesc]] })
                    .catch(err => { throw new Error(err); });
            if (pageCount != 0)
                pageData = await Promise.all(pageData.map(async (data) => {
                    const userData = await (0, userController_1.userFindOne)({ no: data.user_id }).catch(err => { throw new Error(err); });
                    if (userData)
                        data.user_id = userData.nickname;
                    else
                        data.user_id = "탈퇴한 회원";
                    return data;
                }));
            return res.send({ pageCount: pageCount, pageData: pageData });
        }
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "question pageNation");
    }
};
exports.hotQuestion = async (req, res) => {
    // #swagger.tags = ['question']
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const hotQuestion = await Question.findAll({ where: { state: 1, like: { [Op.gte]: 5 }, created: { [Op.gte]: TODAY_START } }, order: [["like", "DESC"]], limit: 5 })
        .catch(err => { throw (0, err_config_1.errConfig)(res, err, "question hotQuestion"); });
    for (var data of hotQuestion) {
        const userData = await (0, userController_1.userFindOne)({ no: data.user_id }).catch(err => { throw (0, err_config_1.errConfig)(res, err, "question hotQuestion"); });
        if (userData) {
            data.user_id = userData.nickname;
        }
        else
            data.user_id = "탈퇴한 회원";
    }
    return res.send(hotQuestion);
};
exports.findQuestion = async (req, res) => {
    // #swagger.tags = ['question']
    const id = req.params.questionId;
    try {
        const question = await Question.findOne({ where: { id: id, state: 1 } }).catch(err => { throw new Error(err); });
        if (question) {
            const userData = await (0, userController_1.userFindOne)({ no: question.user_id }).catch(err => { throw new Error(err); });
            if (userData)
                question.user_id = userData.nickname;
            else
                question.user_id = "탈퇴한 회원";
            await Question.update({ views: question.views + 1 }, { where: { id: id } }).catch(err => { throw new Error(err); });
            return res.send(question);
        }
        else
            return (0, err_config_1.errConfig)(res, null, "no such question");
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "question findQuestion");
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['question']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const no = userData.no;
        const question = {
            title: req.body.title,
            content: req.body.content,
            user_id: no
        };
        const questionData = await Question.create(question, { transaction: transaction }).catch((err) => { throw new Error(err); });
        await (0, searchController_1.create_word)([question.title, question.content], questionData.id, "question", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send(questionData);
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "question create");
    }
};
exports.update = (req, res) => {
    //  #swagger.tags = ['question']
    const title = req.body.title;
    const content = req.body.content;
    const questionId = req.body.questionId;
    return updateQuestion(req, res, updateFunction);
};
exports.delete = (req, res) => {
    //  #swagger.tags = ['question']
    const questionId = req.body.questionId;
    return updateQuestion(req, res, deleteFunction);
};
const updateFunction = async (req, res, questionId, transaction) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        await Question.update({ title: title, content: content }, { where: { id: questionId }, transaction: transaction })
            .catch(err => { throw new Error(err); });
        await (0, searchController_1.delete_word)(questionId, "question", transaction).catch(err => { throw new Error(err); });
        await (0, searchController_1.create_word)([title, content], questionId, "question", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "question update");
    }
};
const deleteFunction = async (req, res, questionId, transaction) => {
    try {
        await Question.update({ state: 0 }, { where: { id: questionId }, transaction: transaction }).catch(err => { throw new Error(err); });
        await (0, searchController_1.delete_word)(questionId, "question", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "question delete");
    }
};
const updateQuestion = async (req, res, updateFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const questionId = req.body.questionId;
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const questionData = await Question.findOne({ where: { id: questionId, state: 1 } }).catch(err => { throw new Error(err); });
        if (questionData) {
            if (questionData.user_id === userData.no) {
                return await updateFunction(req, res, questionId, transaction);
            }
            else
                throw new Error("no permission");
        }
        else
            throw new Error("no such question");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "no such question")
            return (0, err_config_1.errConfig)(res, null, "no such question");
        else if (err.message === "no permission")
            return (0, err_config_1.errConfig)(res, null, "no permission");
        else
            return (0, err_config_1.errConfig)(res, err, "question update");
    }
};
function checkQuestion(questionId) {
    return new Promise((resolve, reject) => {
        Question.findOne({ where: { id: questionId, state: 1 } }).then((data) => {
            if (data)
                resolve(data);
            else
                resolve(false);
        }).catch(err => { reject(err); });
    });
}
exports.checkQuestion = checkQuestion;
function updateQuestionLike(questionId, likeVal, transaction) {
    return new Promise((resolve, reject) => {
        Question.findOne({ where: { id: questionId, state: 1 }, transaction: transaction }).then((data) => {
            if (data || data.like + likeVal >= 0) {
                Question.update({ like: data.like + likeVal }, { where: { id: questionId, state: 1 }, transaction: transaction }).then(data => {
                    resolve(data);
                }).catch(err => { reject(err); });
            }
            else
                reject("no such question or like value is negative");
        }).catch(err => { reject(err); });
    });
}
exports.updateQuestionLike = updateQuestionLike;
function updateQuestionClear(questionId, clearVal, transaction) {
    return new Promise((resolve, reject) => {
        Question.findOne({ where: { id: questionId, state: 1 }, transaction: transaction }).then((questionData) => {
            if (questionData.is_clear === clearVal)
                reject("already clear or canceled");
            else if (questionData) {
                Question.update({ is_clear: clearVal }, { where: { id: questionId, state: 1 }, transaction: transaction }).then(data => {
                    resolve(questionData);
                }).catch(err => { reject(err); });
            }
            else
                reject("no such question");
        }).catch(err => { reject(err); });
    });
}
exports.updateQuestionClear = updateQuestionClear;
//# sourceMappingURL=QuestionController.js.map