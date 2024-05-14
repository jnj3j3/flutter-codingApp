"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const index_1 = require("../models/index");
const Code_board_like = index_1.db.Code_board_like;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
const userController_1 = require("./userController");
const code_boardController_1 = require("./code_boardController");
exports.findAll = async (req, res) => {
    /* #swagger.tags = ['code_board_like']*/
    try {
        const findall = await Code_board_like.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.create = async (req, res) => {
    //  #swagger.tags = ['code_board_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const code_board_like = {
            code_board_id: req.body.code_boardId,
            user_id: userData.no
        };
        const code_boardData = await (0, code_boardController_1.checkCode_board)(req.body.code_boardId, transaction).catch(err => { throw new Error(err); });
        if (code_boardData) {
            const code_board_likeData = await Code_board_like.findOne({ where: code_board_like, transaction: transaction })
                .catch(err => { throw new Error(err); });
            if (code_board_likeData) {
                const updateData = await Code_board_like.update({ state: 1 }, { where: code_board_like, transaction: transaction })
                    .catch(err => { throw new Error(err); });
                if (updateData == 0)
                    throw new Error("nothing changed");
            }
            else {
                await Code_board_like.create(code_board_like, { transaction }).catch(err => { throw new Error(err); });
            }
            await (0, code_boardController_1.updateCode_boardLike)(req.body.code_boardId, 1, transaction).catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such code_board");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "no such code_board")
            return (0, err_config_1.errConfig)(res, null, "no such code_board");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board_like create");
    }
};
exports.cancel = async (req, res) => {
    //  #swagger.tags = ['code_board_like']
    const transaction = await sequelize.transaction();
    try {
        const userData = await (0, userController_1.userCheck)(req).catch(err => { throw new Error(err); });
        const code_board_like = {
            code_board_id: req.body.code_boardId,
            user_id: userData.no,
        };
        const code_board_likeData = await Code_board_like.findOne({ where: code_board_like, transaction: transaction })
            .catch(err => { throw new Error(err); });
        if (code_board_likeData) {
            const updateData = await Code_board_like.update({ state: 0 }, { where: code_board_like, transaction: transaction })
                .catch(err => { throw new Error(err); });
            if (updateData == 0)
                throw new Error("nothing changed");
            await (0, code_boardController_1.updateCode_boardLike)(req.body.code_boardId, -1, transaction)
                .catch(err => { throw new Error(err); });
            await transaction.commit();
            return res.send("success");
        }
        else
            throw new Error("no such code_board_like");
    }
    catch (err) {
        await transaction.rollback();
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else if (err.message === "no such code_board_like")
            return (0, err_config_1.errConfig)(res, null, "no such code_board_like");
        else if (err.message === "nothing changed")
            return (0, err_config_1.errConfig)(res, null, "nothing changed");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board_like cancel");
    }
};
exports.checking = (req, res) => {
    //  #swagger.tags = ['code_board_like']
    (0, userController_1.userCheck)(req).then(data => {
        const code_board_like = {
            code_board_id: req.params.code_boardId,
            user_id: data.no,
            state: 1
        };
        Code_board_like.findOne({ where: code_board_like }).then((data) => {
            if (data)
                return res.send(true);
            else
                return res.send(false);
        }).catch(err => { return (0, err_config_1.errConfig)(res, err, "code_board_like checking - findOne"); });
    }).catch(err => {
        if (err.message === "not logined")
            return (0, err_config_1.errConfig)(res, null, "not logined");
        else
            return (0, err_config_1.errConfig)(res, err, "code_board_like checking - userCheck");
    });
};
//# sourceMappingURL=code_board_likeController.js.map