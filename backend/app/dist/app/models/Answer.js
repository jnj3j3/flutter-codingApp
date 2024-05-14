"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
const db_config_1 = require("./db.config");
class Answer extends db_config_1.seq.Model {
}
exports.Answer = Answer;
Answer.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    parent_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Question',
            key: 'id'
        }
    },
    created: {
        type: db_config_1.seq.DATE
    },
    state: {
        type: db_config_1.seq.INTEGER
    },
    is_selected: {
        type: db_config_1.seq.INTEGER
    },
    like: {
        type: db_config_1.seq.INTEGER
    }
}, {
    modelName: 'Answer',
    tableName: 'Answer',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Answer.js.map