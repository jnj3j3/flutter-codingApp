"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.code_jobsRouter = void 0;
// #swagger.tags = ['code_jobs']
const code_jobs = require("../controllers/code_jobsController");
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get('/allCode_jobs', code_jobs.findAll);
router.post('/start', code_jobs.start);
exports.code_jobsRouter = router;
//# sourceMappingURL=code_jobsRoutes.js.map