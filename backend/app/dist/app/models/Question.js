"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const db_config_1 = require("./db.config");
class Question extends db_config_1.seq.Model {
}
exports.Question = Question;
Question.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: db_config_1.seq.STRING
    },
    content: {
        type: db_config_1.seq.TEXT
    },
    user_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'User',
            key: 'no'
        }
    },
    created: {
        type: db_config_1.seq.DATE
    },
    state: {
        type: db_config_1.seq.INTEGER
    },
    is_clear: {
        type: db_config_1.seq.INTEGER
    },
    views: {
        type: db_config_1.seq.INTEGER
    },
    like: {
        type: db_config_1.seq.INTEGER
    }
}, {
    modelName: 'Question',
    tableName: 'Question',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Question.js.map