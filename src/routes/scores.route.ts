import express from "express";
import { deleteScore, getRecordId, getScoreInfo, getScores, getUserLastScore, uploadScores } from "../controllers/scores.controller";
import { verifyToken } from "../middleWares/verifyToken";
import { updateLastActiveTime } from "../controllers/user.controller";

const router = express.Router();

router.use(verifyToken);
// router.use(updateLastActiveTime);
router.get("/getLastRecordId", getRecordId);
router.get("/getScoreInfo/:userId/:selectedType", getScoreInfo);
router.get("/getScores/:recordId", getScores);
router.get("/getUserLastScore/:data/:id", getUserLastScore);
router.delete("/delete/:recordId/:subject/:year", deleteScore);
router.put("/uploads/:recordId", uploadScores);

export default  router;