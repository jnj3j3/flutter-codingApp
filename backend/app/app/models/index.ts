import {sequelize, seq} from './db.config'
import {User,UserReq} from './User'
import {Code_jobs,Code_jobsReq} from './Code_jobs'
import {Code_board,Code_boardReq,Code_boardRes,Code_boardUpdate} from './Code_board'
import { Code_board_like,code_board_likeReq } from './Code_board_like'
import { Question,QuestionReq } from './Question'
import {Question_like,question_likeReq} from './Question_like'
import { Answer,AnswerReq } from './Answer'
import { Answer_like,Answer_likeReq } from './Answer_like'
import { Question_word } from './Question_word'
import { Question_reverse_word } from './Question_reverse_word'
import { Code_board_word } from './Code_board_word'
import { Code_board_reverse_word } from './Code_board_reverse_word'
import { FCM } from './FCM'
export const db = {
  Sequelize: seq,
  sequelize: sequelize,
  // tutorial: require("./model.js")(sequelize),
  User: User,
  Code_jobs: Code_jobs,
  Code_board: Code_board,
  Code_board_like: Code_board_like,
  Question: Question,
  Question_like: Question_like,
  Answer: Answer,
  Answer_like: Answer_like,
  Question_word: Question_word,
  Question_reverse_word: Question_reverse_word,
  Code_board_word: Code_board_word,
  Code_board_reverse_word: Code_board_reverse_word,
  FCM: FCM
};

export {Answer_likeReq,AnswerReq,UserReq,Code_jobsReq,Code_boardReq,Code_boardRes,Code_boardUpdate,code_board_likeReq,QuestionReq,question_likeReq}