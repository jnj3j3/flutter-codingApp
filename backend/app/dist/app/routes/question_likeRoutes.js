"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.question_likeRouter = void 0;
// #swagger.tags = ['Code_jobs']
const question_like = require("../controllers/question_likeController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allQuestion_like", question_like.findAll);
router.post("/createQuestion_like", authJWT, question_like.create);
router.delete("/deleteQuestion_like", authJWT, question_like.cancel);
router.get("/checkQuestion_like/:questionId", authJWT, question_like.checking);
exports.question_likeRouter = router;
//# sourceMappingURL=question_likeRoutes.js.map