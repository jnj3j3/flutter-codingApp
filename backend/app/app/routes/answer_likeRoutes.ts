// #swagger.tags = ['Code_jobs']
const answer_like  = require("../controllers/answer_likeController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allAnswer_like",answer_like.findAll);

router.post("/createAnswer_like",authJWT,answer_like.create);

router.delete("/deleteAnswer_like",authJWT,answer_like.cancel);

router.get("/checkAnswer_like/:answerId",authJWT,answer_like.checking);

export const answer_likeRouter = router;