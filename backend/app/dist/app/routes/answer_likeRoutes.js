"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answer_likeRouter = void 0;
// #swagger.tags = ['Code_jobs']
const answer_like = require("../controllers/answer_likeController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allAnswer_like", answer_like.findAll);
router.post("/createAnswer_like", authJWT, answer_like.create);
router.delete("/deleteAnswer_like", authJWT, answer_like.cancel);
router.get("/checkAnswer_like/:answerId", authJWT, answer_like.checking);
exports.answer_likeRouter = router;
//# sourceMappingURL=answer_likeRoutes.js.map