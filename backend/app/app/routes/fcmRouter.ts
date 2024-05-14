// #swagger.tags = ['Code_jobs']
const FCM  = require("../controllers/fcmController");
const authJWT = require("../utils/authJWT");
import express from 'express';
var router = express.Router();

router.get("/allFCM",FCM.findAll);

router.post("/createFCM",authJWT,FCM.create);

export const fcmRouter = router;