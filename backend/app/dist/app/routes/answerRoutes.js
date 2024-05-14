"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerRouter = void 0;
// #swagger.tags = ['Question']
const answer = require("../controllers/answerController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allAnswer", answer.findAll);
router.get("/pageBoard/:page/:parentId", answer.pageNation);
router.post("/createAnswer", authJWT, answer.create);
router.patch("/updateAnswer", authJWT, answer.update);
router.delete("/deleteAnswer", authJWT, answer.delete);
router.patch("/selectAnswer", authJWT, answer.select);
exports.answerRouter = router;
//# sourceMappingURL=answerRoutes.js.map