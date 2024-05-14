"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.code_jobsFindOne = void 0;
require("dotenv").config();
const index_1 = require("../models/index");
const Code_jobs = index_1.db.Code_jobs;
const sequelize = index_1.db.sequelize;
const err_config_1 = require("../config/err.config");
exports.findAll = async (req, res) => {
    // #swagger.tags = ['code_jobs']
    try {
        const findall = await Code_jobs.findAll();
        return res.send(findall);
    }
    catch (err) {
        return res.status(500).send({
            message: err || "Some error occured."
        });
    }
};
exports.start = (req, res) => {
    // #swagger.tags = ['code_jobs']
    const code = req.body.code;
    const code_job = {
        language: req.body.langauge,
        code: code,
    };
    Code_jobs.create(code_job).then(async (createData) => {
        const code_jobs_id = createData.id;
        var errMessage = null;
        while (createData.output === null || createData.output === undefined) {
            await sleep(1000);
            Code_jobs.findOne({ where: { id: code_jobs_id } }).then(findOneData => {
                if (findOneData)
                    createData.output = findOneData.output;
                else
                    errMessage = "Code_jobs created but can't find it";
            }).catch(err => {
                errMessage = err;
            });
        }
        if (errMessage !== null)
            return (0, err_config_1.errConfig)(res, errMessage, "Code_jobs start findoutput");
        else
            return res.send(createData);
    }).catch((err) => { return (0, err_config_1.errConfig)(res, err, "code_jobs start create"); });
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function code_jobsFindOne(where) {
    return new Promise((resolve, reject) => {
        Code_jobs.findOne(where).then(data => {
            if (data)
                resolve(data);
            else
                resolve(false);
        }).catch(err => { reject(err); });
    });
}
exports.code_jobsFindOne = code_jobsFindOne;
//# sourceMappingURL=code_jobsController.js.map