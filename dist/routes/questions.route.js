"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const questions_controller_1 = require("../controllers/questions.controller");
const dbConnect_1 = require("../libs/dbConnect");
const questionFileUpload_1 = require("../service/utility/questionFileUpload");
const verifyToken_1 = require("../middleWares/verifyToken");
const user_controller_1 = require("../controllers/user.controller");
const router = express.Router();
router.use((req, res, next) => {
    req.connect = dbConnect_1.jambDB;
    next();
});
router.get("/getDatabases", questions_controller_1.getDatabases);
router.get("/getTables", questions_controller_1.getTables);
router.get("/getAllYears/:subject", questions_controller_1.getYears);
router.get("/getPastQuestion/:subject/:year", questions_controller_1.getPastQuestionByYear);
router.get("/uploadQuestionRoute/:subject/:year", questions_controller_1.getPastQuestionByYear);
router.get("/getRandomQuestions/:subjects", questions_controller_1.getRandomQuestions);
router.use(verifyToken_1.verifyToken);
router.use(user_controller_1.updateLastActiveTime);
router.post("/getQuestionsWithId", questions_controller_1.getPastQuestionById);
router.delete("/deletePastQuestion/:subject/:year", questions_controller_1.deletePastQuestion);
router.put("/uploadPastQuestion/:subject/:year", questionFileUpload_1.uploadQuestion.single("questionFile"), questions_controller_1.uploadPastQuestion);
exports.default = router;
//# sourceMappingURL=questions.route.js.map