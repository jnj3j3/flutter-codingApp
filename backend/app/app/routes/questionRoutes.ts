// #swagger.tags = ['Question']
const question  = require("../controllers/QuestionController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allQuestion",question.findAll);

router.get("/findQuestion/:questionId",question.findQuestion);

router.get("/pageQuestion/:searchSentence/:order/:isDesc/:page",question.pageNation);

router.post("/createQuestion",authJWT,question.create);

router.patch("/updateQuestion",authJWT,question.update);

router.delete("/deleteQuestion",authJWT,question.delete);

router.get("/hotQuestion",question.hotQuestion);

export const questionRouter = router;