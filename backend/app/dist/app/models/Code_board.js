"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code_board = void 0;
const db_config_1 = require("./db.config");
class Code_board extends db_config_1.seq.Model {
}
exports.Code_board = Code_board;
Code_board.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: db_config_1.seq.STRING
    },
    language: {
        type: db_config_1.seq.STRING
    },
    code: {
        type: db_config_1.seq.TEXT
    },
    created: {
        type: db_config_1.seq.DATE
    },
    user_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'User',
            key: 'no'
        }
    },
    code_jobs_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Code_jobs',
            key: 'id'
        }
    },
    like: {
        type: db_config_1.seq.INTEGER
    },
    state: {
        type: db_config_1.seq.INTEGER
    }
}, {
    modelName: 'Code_board',
    tableName: 'Code_board',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Code_board.js.map