"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question_word = void 0;
const db_config_1 = require("./db.config");
class Question_word extends db_config_1.seq.Model {
}
exports.Question_word = Question_word;
Question_word.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    word: {
        type: db_config_1.seq.STRING
    },
    count: {
        type: db_config_1.seq.INTEGER
    }
}, {
    modelName: 'Question_word',
    tableName: 'Question_word',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Question_word.js.map