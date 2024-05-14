"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionRouter = void 0;
// #swagger.tags = ['Question']
const question = require("../controllers/QuestionController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allQuestion", question.findAll);
router.get("/findQuestion/:questionId", question.findQuestion);
router.get("/pageQuestion/:searchSentence/:order/:isDesc/:page", question.pageNation);
router.post("/createQuestion", authJWT, question.create);
router.patch("/updateQuestion", authJWT, question.update);
router.delete("/deleteQuestion", authJWT, question.delete);
router.get("/hotQuestion", question.hotQuestion);
exports.questionRouter = router;
//# sourceMappingURL=questionRoutes.js.map