"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const app = (0, express_1.default)();
var corsOptions = {
    origin: "http://localhost:80"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express_1.default.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true }));
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
const index_1 = require("./app/models/index");
index_1.db.sequelize.sync();
const userRoutes_1 = require("./app/routes/userRoutes");
const code_boardRoutes_1 = require("./app/routes/code_boardRoutes");
const code_jobsRoutes_1 = require("./app/routes/code_jobsRoutes");
const code_board_likeRoutes_1 = require("./app/routes/code_board_likeRoutes");
const questionRoutes_1 = require("./app/routes/questionRoutes");
const question_likeRoutes_1 = require("./app/routes/question_likeRoutes");
const answerRoutes_1 = require("./app/routes/answerRoutes");
const answer_likeRoutes_1 = require("./app/routes/answer_likeRoutes");
const fcmRouter_1 = require("./app/routes/fcmRouter");
app.use('/user/', userRoutes_1.userRouter);
app.use('/code_board/', code_boardRoutes_1.code_boardRouter);
app.use('/code_jobs/', code_jobsRoutes_1.code_jobsRouter);
app.use('/code_board_like/', code_board_likeRoutes_1.code_board_likeRouter);
app.use('/question/', questionRoutes_1.questionRouter);
app.use('/question_like/', question_likeRoutes_1.question_likeRouter);
app.use('/answer/', answerRoutes_1.answerRouter);
app.use('/answer_like/', answer_likeRoutes_1.answer_likeRouter);
app.use('/fcm/', fcmRouter_1.fcmRouter);
// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
//# sourceMappingURL=server.js.map