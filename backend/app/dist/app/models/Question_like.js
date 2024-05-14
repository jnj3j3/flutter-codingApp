"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question_like = void 0;
const db_config_1 = require("./db.config");
class Question_like extends db_config_1.seq.Model {
}
exports.Question_like = Question_like;
Question_like.init({
    question_id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        references: {
            model: 'Question',
            key: 'id'
        }
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
    }
}, {
    modelName: 'Question_like',
    tableName: 'Question_like',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Question_like.js.map