"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code_board_like = void 0;
const db_config_1 = require("./db.config");
class Code_board_like extends db_config_1.seq.Model {
}
exports.Code_board_like = Code_board_like;
Code_board_like.init({
    code_board_id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        references: {
            model: 'Code_board',
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
    modelName: 'Code_board_like',
    tableName: 'Code_board_like',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Code_board_like.js.map