// #swagger.tags = ['Question']
const answer  = require("../controllers/answerController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allAnswer",answer.findAll);


router.get("/pageBoard/:page/:parentId",answer.pageNation);

router.post("/createAnswer",authJWT,answer.create);

router.patch("/updateAnswer",authJWT,answer.update);

router.delete("/deleteAnswer",authJWT,answer.delete);

router.patch("/selectAnswer",authJWT,answer.select);

export const answerRouter = router;