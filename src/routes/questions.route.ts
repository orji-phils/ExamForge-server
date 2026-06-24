import * as express from "express";
import { uploadPastQuestion, deletePastQuestion, getDatabases, getPastQuestionById, getPastQuestionByYear, getRandomQuestions, getTables, getYears } from "../controllers/questions.controller";
import { jambDB } from "../libs/dbConnect";
import { uploadQuestion } from "../service/utility/questionFileUpload";
import { verifyToken } from "../middleWares/verifyToken";
import { updateLastActiveTime } from "../controllers/user.controller";

const router = express.Router();

router.use ((req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.connect = jambDB;
    next();
});
router.get("/getDatabases", getDatabases);
router.get("/getTables", getTables);
router.get("/getAllYears/:subject", getYears);
router.get("/getPastQuestion/:subject/:year", getPastQuestionByYear);
router.get("/uploadQuestionRoute/:subject/:year", getPastQuestionByYear);
router.get("/getRandomQuestions/:subjects", getRandomQuestions);

router.use(verifyToken);
router.use(updateLastActiveTime);
router.post("/getQuestionsWithId", getPastQuestionById);
router.delete("/deletePastQuestion/:subject/:year", deletePastQuestion);
router.put("/uploadPastQuestion/:subject/:year", uploadQuestion.single("questionFile"), uploadPastQuestion);

export default router;