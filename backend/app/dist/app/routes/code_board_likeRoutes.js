"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.code_board_likeRouter = void 0;
// #swagger.tags = ['Code_jobs']
const code_board_like = require("../controllers/code_board_likeController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allCode_board_like", code_board_like.findAll);
router.post("/createCode_board_like", authJWT, code_board_like.create);
router.delete("/deleteCode_board_like", authJWT, code_board_like.cancel);
router.get("/checkCode_board_like/:code_boardId", authJWT, code_board_like.checking);
exports.code_board_likeRouter = router;
//# sourceMappingURL=code_board_likeRoutes.js.map