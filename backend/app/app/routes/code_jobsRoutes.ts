// #swagger.tags = ['code_jobs']
const code_jobs  = require("../controllers/code_jobsController");
import express from 'express';
var router = express.Router();

router.get('/allCode_jobs',code_jobs.findAll);
router.post('/start',code_jobs.start);

export const code_jobsRouter = router;