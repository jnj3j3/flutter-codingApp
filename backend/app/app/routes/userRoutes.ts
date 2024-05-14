// #swagger.tags = ['User']
const user  = require("../controllers/userController");
const authJWT = require("../utils/authJWT");
import express from 'express';

var router = express.Router();

router.get("/allUsers",user.findAll );

router.post("/createUser",user.create);

router.get("/check/:name/:value",user.checkOne);

router.post("/login",user.login);

router.get("/logout",authJWT,user.logout);

router.delete("/deleteUser",authJWT,user.delete);

router.patch("/updateUser",authJWT,user.update);

router.get("/checkToken",authJWT,user.checkJwt);

router.get("/refreshToken",user.refreshToken);

router.get("/getNickname",user.findNicknameWithNo);

export const userRouter= router;