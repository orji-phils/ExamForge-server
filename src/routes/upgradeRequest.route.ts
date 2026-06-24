import * as express from "express";
import { approveRequest, deleteRequest, getSingleUpgradeRequest, getUpgradeData, getUpgradeRequests, rejectRequest, restoreAdmin, revokeAccess, upgradeAccount, upgradeToMaster } from "../controllers/upgradeRequest.controller";
import { verifyToken } from "../middleWares/verifyToken";
import { updateLastActiveTime } from "../controllers/user.controller";

const router = express.Router();

router.use(verifyToken);
router.use(updateLastActiveTime);
router.get("/get/userId/:id", getSingleUpgradeRequest);
router.get("/get/status/:status", getUpgradeRequests);
router.get("/get/userName/:userName", getUpgradeData);
router.delete("/delete/:userId/:userName", deleteRequest );
router.patch("/revoke/:userId/:userName", revokeAccess);
router.patch("/restore/:userId/:userName", restoreAdmin);
router.patch("/approve/:userId/:userName", approveRequest);
router.patch("/upgrade/:userId/:userName", upgradeToMaster);
router.patch("/reject/:userId/:userName", rejectRequest);
router.post("/apply", upgradeAccount);

export default router;