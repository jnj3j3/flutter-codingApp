"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer_like = void 0;
const db_config_1 = require("./db.config");
class Answer_like extends db_config_1.seq.Model {
}
exports.Answer_like = Answer_like;
Answer_like.init({
    answer_id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        references: {
            model: 'Answer',
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
    modelName: 'Answer_like',
    tableName: 'Answer_like',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Answer_like.js.map