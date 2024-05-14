"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.code_boardRouter = void 0;
// #swagger.tags = ['Code_jobs']
const code_board = require("../controllers/code_boardController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allCode_boards", code_board.findAll);
router.get("/findBoard/:boardId", code_board.findBoard);
router.post("/createCodeBoard", authJWT, code_board.create);
router.patch("/updateCodeBoard", authJWT, code_board.update);
router.delete("/deleteCodeBoard", authJWT, code_board.delete);
router.patch("/saveOutput", code_board.saveOutput);
router.get("/pageBoard/:searchSentence/:order/:isDesc/:page/:language", code_board.pageNation);
router.get("/hotBoard", code_board.hotBoard);
exports.code_boardRouter = router;
//# sourceMappingURL=code_boardRoutes.js.map