"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmRouter = void 0;
// #swagger.tags = ['Code_jobs']
const FCM = require("../controllers/fcmController");
const authJWT = require("../utils/authJWT");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/allFCM", FCM.findAll);
router.post("/createFCM", authJWT, FCM.create);
exports.fcmRouter = router;
//# sourceMappingURL=fcmRouter.js.map