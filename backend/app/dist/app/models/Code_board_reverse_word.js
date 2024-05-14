"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code_board_reverse_word = void 0;
const db_config_1 = require("./db.config");
class Code_board_reverse_word extends db_config_1.seq.Model {
}
exports.Code_board_reverse_word = Code_board_reverse_word;
Code_board_reverse_word.init({
    id: {
        type: db_config_1.seq.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    word_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Code_board_word',
            key: 'id'
        }
    },
    code_board_id: {
        type: db_config_1.seq.INTEGER,
        references: {
            model: 'Code_board',
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
    modelName: 'Code_board_reverse_word',
    tableName: 'Code_board_reverse_word',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Code_board_reverse_word.js.map