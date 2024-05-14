"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question_reverse_word = void 0;
const db_config_1 = require("./db.config");
class Question_reverse_word extends db_config_1.seq.Model {
}
exports.Question_reverse_word = Question_reverse_word;
Question_reverse_word.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    word_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Question_word',
            key: 'id'
        }
    },
    question_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Question',
            key: 'id'
        }
    },
    count: {
        type: db_config_1.seq.INTEGER
    },
    weight: {
        type: db_config_1.seq.DOUBLE
    }
}, {
    modelName: 'Question_reverse_word',
    tableName: 'Question_reverse_word',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Question_reverse_word.js.map