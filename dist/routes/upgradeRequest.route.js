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
const upgradeRequest_controller_1 = require("../controllers/upgradeRequest.controller");
const verifyToken_1 = require("../middleWares/verifyToken");
const user_controller_1 = require("../controllers/user.controller");
const router = express.Router();
router.use(verifyToken_1.verifyToken);
router.use(user_controller_1.updateLastActiveTime);
router.get("/get/userId/:id", upgradeRequest_controller_1.getSingleUpgradeRequest);
router.get("/get/status/:status", upgradeRequest_controller_1.getUpgradeRequests);
router.get("/get/userName/:userName", upgradeRequest_controller_1.getUpgradeData);
router.delete("/delete/:userId/:userName", upgradeRequest_controller_1.deleteRequest);
router.patch("/revoke/:userId/:userName", upgradeRequest_controller_1.revokeAccess);
router.patch("/restore/:userId/:userName", upgradeRequest_controller_1.restoreAdmin);
router.patch("/approve/:userId/:userName", upgradeRequest_controller_1.approveRequest);
router.patch("/upgrade/:userId/:userName", upgradeRequest_controller_1.upgradeToMaster);
router.patch("/reject/:userId/:userName", upgradeRequest_controller_1.rejectRequest);
router.post("/apply", upgradeRequest_controller_1.upgradeAccount);
exports.default = router;
//# sourceMappingURL=upgradeRequest.route.js.map