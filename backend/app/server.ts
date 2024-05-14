require("dotenv").config();
import express from 'express';
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:80"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

import {db} from "./app/models/index";
db.sequelize.sync();


import {userRouter} from "./app/routes/userRoutes";
import {code_boardRouter} from "./app/routes/code_boardRoutes";
import { code_jobsRouter } from './app/routes/code_jobsRoutes';
import { code_board_likeRouter } from './app/routes/code_board_likeRoutes';
import { questionRouter } from './app/routes/questionRoutes';
import { question_likeRouter } from './app/routes/question_likeRoutes';
import { answerRouter } from './app/routes/answerRoutes';
import { answer_likeRouter } from './app/routes/answer_likeRoutes';
import { fcmRouter } from './app/routes/fcmRouter';
app.use('/user/', userRouter);
app.use('/code_board/', code_boardRouter);
app.use('/code_jobs/',code_jobsRouter)
app.use('/code_board_like/',code_board_likeRouter)
app.use('/question/',questionRouter)
app.use('/question_like/',question_likeRouter)
app.use('/answer/',answerRouter)
app.use('/answer_like/',answer_likeRouter)
app.use('/fcm/',fcmRouter)
// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

