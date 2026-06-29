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
const user_controller_1 = require("../controllers/user.controller");
const verifyToken_1 = require("../middleWares/verifyToken");
const router = express.Router();
router.get("/resetPasswordMail/:email", user_controller_1.passwordResetMail);
router.patch("/updatePassword/:token/:id", user_controller_1.updatePassword);
router.use(verifyToken_1.verifyToken);
router.use(user_controller_1.updateLastActiveTime);
router.get("/get/userId/:id", user_controller_1.getUser);
router.get("/get/userName/:userName", user_controller_1.getUserViaUserName);
router.get("/getUserByType/:role", user_controller_1.getUserByType);
router.get("/getFullUserData/:id", user_controller_1.getFulldata);
router.get("/getLastActiveTime/:userId", user_controller_1.getLastActiveTime);
router.delete("/deleteUser/:userId/:userName", user_controller_1.deleteUser);
router.patch("/updateUser", user_controller_1.updateUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map