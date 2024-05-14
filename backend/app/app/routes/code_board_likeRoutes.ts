// #swagger.tags = ['Code_jobs']
const code_board_like  = require("../controllers/code_board_likeController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allCode_board_like",code_board_like.findAll);

router.post("/createCode_board_like",authJWT,code_board_like.create);

router.delete("/deleteCode_board_like",authJWT,code_board_like.cancel);

router.get("/checkCode_board_like/:code_boardId",authJWT,code_board_like.checking);

export const code_board_likeRouter = router;