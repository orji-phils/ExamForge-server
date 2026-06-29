"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scores_controller_1 = require("../controllers/scores.controller");
const verifyToken_1 = require("../middleWares/verifyToken");
const router = express_1.default.Router();
router.use(verifyToken_1.verifyToken);
// router.use(updateLastActiveTime);
router.get("/getLastRecordId", scores_controller_1.getRecordId);
router.get("/getScoreInfo/:userId/:selectedType", scores_controller_1.getScoreInfo);
router.get("/getScores/:recordId", scores_controller_1.getScores);
router.get("/getUserLastScore/:data/:id", scores_controller_1.getUserLastScore);
router.delete("/delete/:recordId/:subject/:year", scores_controller_1.deleteScore);
router.put("/uploads/:recordId", scores_controller_1.uploadScores);
exports.default = router;
//# sourceMappingURL=scores.route.js.map