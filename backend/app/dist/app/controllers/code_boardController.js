"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCode_boardLike = exports.checkCode_board = void 0;
require("dotenv").config();
const index_1 = require("../models/index");
const Code_board = index_1.db.Code_board;
const sequelize = index_1.db.sequelize;
const userController_1 = require("./userController");
const code_jobsController_1 = require("./code_jobsController");
const err_config_1 = require("../config/err.config");
const searchController_1 = require("./searchController");
const Op = index_1.db.Sequelize.Op;
exports.findAll = async (req, res) => {
    /*  #swagger.tags = ['code_board']
    */
    try {
        const findall = await Code_board.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.findBoard = async (req, res) => {
    // #swagger.tags = ['code_board']
    const id = req.params.boardId;
    try {
        const codeBoard = await Code_board.findOne({ where: { id: id, state: 1 } }).catch(err => { throw new Error(err); });
        if (codeBoard != null) {
            const userData = await (0, userController_1.userFindOne)({ where: { no: codeBoard.user_id } }).catch(err => { throw new Error(err); });
            if (userData)
                codeBoard.user_id = userData.nickname;
            else
                codeBoard.user_id = "탈퇴한 회원"; //user_id is not id but nickname
            return res.send(codeBoard);
        }
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "code_board findBoard");
    }
};
exports.hotBoard = async (req, res) => {
    // #swagger.tags = ['code_board']
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const hotBoard = await Code_board.findAll({ where: { state: 1, like: { [Op.gte]: 5 }, created: { [Op.gte]: TODAY_START } }, order: [["like", "DESC"]], limit: 5 })
        .catch(err => { throw (0, err_config_1.errConfig)(res, err, "code_board hotBoard"); });
    for (var data of hotBoard) {
        const userData = await (0, userController_1.userFindOne)({ no: data.user_id }).catch(err => { throw new Error(err); });
        if (userData)
            data.user_id = userData.nickname;
        else
            data.user_id = "탈퇴한 회원";
    }
    return res.send(hotBoard);
};
exports.pageNation = async (req, res) => {
    // #swagger.tags = ['code_board']
    try {
        const page = parseInt(req.params.page) * 10;
        const order = req.params.order;
        const isDesc = req.params.isDesc === "true" ? "DESC" : "ASC";
        const language = req.params.language;
        const searchSentence = req.params.searchSentence;
        var pageCount;
        var pageData;
        if (searchSentence === " ") {
            var code_boardArray = [];
            for (let searchData of await (0, searchController_1.search)(searchSentence, "code_board").catch(err => { throw new Error(err); })) {
                const code_board = language === " " ? await Code_board.findOne({ where: { id: searchData[0], state: 1 } })
                    .catch(err => { throw new Error(err); })
                    : await Code_board.findOne({ where: { id: searchData[0], state: 1, language: language } }).catch(err => { throw new Error(err); });
                if (code_board)
                    code_boardArray.push(code_board);
            }
            pageCount = code_boardArray.length;
            pageData = code_boardArray.slice(page, page + 10);
            if (pageCount != 0)
                pageData = await Promise.all(pageData.map(async (data) => {
                    const userData = await (0, userController_1.userFindOne)({ where: { no: data.user_id } }).catch(err => { throw new Error(err); });
                    if (userData)
                        data.user_id = userData.nickname;
                    else
                        data.user_id = "탈퇴한 회원";
                }));
            return res.send({ pageCount: pageCount, pageData: pageData });
        }
        else {
            pageCount = language === " " ? await Code_board.count({ where: { state: 1 } })
                .catch(err => { throw new Error(err); })
                : await Code_board.count({ where: { state: 1, language: language } }).catch(err => { throw new Error(err); });
            pageData = language === " " ? await Code_board.findAll({ where: { state: 1 }, offset: page * 10, limit: 10, order: [order, isDesc] })
                .catch(err => { throw new Error(err); })
                : await Code_board.findAll({ where: { state: 1, language: language }, offset: page * 10, limit: 10, order: [order, isDesc] })
                    .catch(err => { throw new Error(err); });
        }
        return res.send({ pageCount: pageCount, pageData: pageData });
    }
    catch (err) {
        return (0, err_config_1.errConfig)(res, err, "code_board pageNation");
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['code_board']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const code = req.body.code;
        const code_job = {
            title: req.body.title,
            language: req.body.langauge,
            code: code,
            user_id: userData.no
        };
        const code_boardData = await Code_board.create(code_job, { transaction }).catch(err => { throw new Error(err); });
        await (0, searchController_1.create_word)([code_boardData.title], code_boardData.id, "code_board", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send(code_boardData);
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board create");
    }
};
exports.update = (req, res) => {
    //  #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    const code = req.body.code;
    const language = req.body.langauge; // wrote these variable for swagger so later i must delete these
    return updateBoard(req, res, updateFunction);
};
exports.delete = (req, res) => {
    //  #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    return updateBoard(req, res, deleteFunction);
};
exports.saveOutput = (req, res) => {
    // #swagger.tags = ['code_board']
    const boardId = req.body.boardId;
    const code_jobs_id = req.body.code_jobs_id;
    return updateBoard(req, res, comebineToJobs);
};
const updateFunction = async (req, res, boardId, transaction) => {
    try {
        const code = req.body.code;
        const code_job = {
            title: req.body.title,
            language: req.body.langauge,
            code: code
        };
        await Code_board.update(code_job, { where: { id: boardId, state: 1 }, transaction: transaction }).catch(err => { throw new Error(err); });
        await (0, searchController_1.delete_word)(boardId, "code_board", transaction).catch(err => { throw new Error(err); });
        await (0, searchController_1.create_word)([code_job.title], boardId, "code_board", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "code_board update");
    }
};
const deleteFunction = async (req, res, boardId, transaction) => {
    try {
        await Code_board.update({ state: 0 }, { where: { id: boardId, state: 1 }, transaction: transaction }).catch(err => { throw new Error(err); });
        await (0, searchController_1.delete_word)(boardId, "code_board", transaction).catch(err => { throw new Error(err); });
        await transaction.commit();
        return res.send("success");
    }
    catch (err) {
        await transaction.rollback();
        return (0, err_config_1.errConfig)(res, err, "code_board delete");
    }
};
const comebineToJobs = async (req, res, boardId, transaction) => {
    try {
        const code_jobs_id = req.body.code_jobs_id;
        const code_jobsData = await (0, code_jobsController_1.code_jobsFindOne)({ where: { id: code_jobs_id }, transaction: transaction })
            .catch(err => { throw new Error(err); });
        if (code_jobsData) {
            await Code_board.update({ code_jobs_id: code_jobs_id }, { where: { id: boardId, state: 1 }, transaction: transaction })
                .catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such code_jobs");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "no such code_jobs")
            return (0, err_config_1.errConfig)(res, null, "no such code_jobs");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board combineToJobs");
    }
};
const updateBoard = async (req, res, updateFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const boardId = req.body.boardId;
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const code_boardData = await Code_board.findOne({ where: { id: boardId, state: 1 }, transaction: transaction })
            .catch(err => { throw new Error(err); });
        if (code_boardData) {
            if (code_boardData.user_id === userData.no) {
                return await updateFunction(req, res, boardId, transaction);
            }
            else
                throw new Error("no permission");
        }
        else
            throw new Error("no such board");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "no such board")
            return (0, err_config_1.errConfig)(res, null, "no such board");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board update");
    }
};
function checkCode_board(boardId, transaction) {
    return new Promise((resolve, reject) => {
        Code_board.findOne({ where: { id: boardId, state: 1 }, transaction: transaction }).then((data) => {
            if (data)
                resolve(data);
            else
                resolve(false);
        }).catch(err => { reject(err); });
    });
}
exports.checkCode_board = checkCode_board;
function updateCode_boardLike(code_boardId, likeVal, transaction) {
    return new Promise((resolve, reject) => {
        Code_board.findOne({ where: { id: code_boardId, state: 1 }, transaction: transaction }).then((data) => {
            if (data || data.like + likeVal >= 0) {
                Code_board.update({ like: data.like + likeVal }, { where: { id: code_boardId, state: 1 }, transaction: transaction }).then(data => {
                    resolve(data);
                }).catch(err => { reject(err); });
            }
            else
                reject("no such code_board or like value is negative");
        }).catch(err => { reject(err); });
    });
}
exports.updateCode_boardLike = updateCode_boardLike;
//# sourceMappingURL=code_boardController.js.map