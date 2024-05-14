"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Code_board_word = void 0;
const db_config_1 = require("./db.config");
class Code_board_word extends db_config_1.seq.Model {
}
exports.Code_board_word = Code_board_word;
Code_board_word.init({
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
    modelName: 'Code_board_word',
    tableName: 'Code_board_word',
    sequelize: db_config_1.sequelize,
    timestamps: false,
    freezeTableName: true
});
//# sourceMappingURL=Code_board_word.js.map