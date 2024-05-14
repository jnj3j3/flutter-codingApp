"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const db_config_1 = require("./db.config");
const User_1 = require("./User");
const Code_jobs_1 = require("./Code_jobs");
const Code_board_1 = require("./Code_board");
const Code_board_like_1 = require("./Code_board_like");
const Question_1 = require("./Question");
const Question_like_1 = require("./Question_like");
const Answer_1 = require("./Answer");
const Answer_like_1 = require("./Answer_like");
const Question_word_1 = require("./Question_word");
const Question_reverse_word_1 = require("./Question_reverse_word");
const Code_board_word_1 = require("./Code_board_word");
const Code_board_reverse_word_1 = require("./Code_board_reverse_word");
const FCM_1 = require("./FCM");
exports.db = {
    Sequelize: db_config_1.seq,
    sequelize: db_config_1.sequelize,
    // tutorial: require("./model.js")(sequelize),
    User: User_1.User,
    Code_jobs: Code_jobs_1.Code_jobs,
    Code_board: Code_board_1.Code_board,
    Code_board_like: Code_board_like_1.Code_board_like,
    Question: Question_1.Question,
    Question_like: Question_like_1.Question_like,
    Answer: Answer_1.Answer,
    Answer_like: Answer_like_1.Answer_like,
    Question_word: Question_word_1.Question_word,
    Question_reverse_word: Question_reverse_word_1.Question_reverse_word,
    Code_board_word: Code_board_word_1.Code_board_word,
    Code_board_reverse_word: Code_board_reverse_word_1.Code_board_reverse_word,
    FCM: FCM_1.FCM
};
//# sourceMappingURL=index.js.map