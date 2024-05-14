// #swagger.tags = ['Code_jobs']
const code_board  = require("../controllers/code_boardController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allCode_boards",code_board.findAll);

router.get("/findBoard/:boardId",code_board.findBoard);

router.post("/createCodeBoard",authJWT,code_board.create);

router.patch("/updateCodeBoard",authJWT,code_board.update);

router.delete("/deleteCodeBoard",authJWT,code_board.delete);

router.patch("/saveOutput",code_board.saveOutput);

router.get("/pageBoard/:searchSentence/:order/:isDesc/:page/:language",code_board.pageNation);

router.get("/hotBoard",code_board.hotBoard);

export const code_boardRouter = router;