// #swagger.tags = ['Code_jobs']
const question_like  = require("../controllers/question_likeController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allQuestion_like",question_like.findAll);

router.post("/createQuestion_like",authJWT,question_like.create);

router.delete("/deleteQuestion_like",authJWT,question_like.cancel);

router.get("/checkQuestion_like/:questionId",authJWT,question_like.checking);

export const question_likeRouter = router;