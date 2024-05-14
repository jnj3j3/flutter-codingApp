"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code_jobs = void 0;
const db_config_1 = require("./db.config");
class Code_jobs extends db_config_1.seq.Model {
}
exports.Code_jobs = Code_jobs;
Code_jobs.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    language: {
        type: db_config_1.seq.STRING
    },
    code: {
        type: db_config_1.seq.TEXT
    },
    status: {
        type: db_config_1.seq.STRING
    },
    error: {
        type: db_config_1.seq.TEXT
    },
    status_updated: {
        type: db_config_1.seq.DATE
    },
    output: {
        type: db_config_1.seq.TEXT
    },
    last_read_line: {
        type: db_config_1.seq.INTEGER
    },
}, {
    modelName: 'Code_jobs',
    tableName: 'Code_jobs',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Code_jobs.js.map