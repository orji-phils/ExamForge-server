import * as express from "express";
import { deleteUser, getUserByType, getUser, updatePassword, updateUser, getFulldata, updateLastActiveTime, getLastActiveTime, passwordResetMail, getUserViaUserName } from "../controllers/user.controller";
import { verifyToken } from "../middleWares/verifyToken";

const router = express.Router();

router.get("/resetPasswordMail/:email", passwordResetMail);
router.patch("/updatePassword/:token/:id", updatePassword);

router.use(verifyToken);
router.use(updateLastActiveTime);
router.get("/get/userId/:id", getUser);
router.get("/get/userName/:userName", getUserViaUserName);
router.get("/getUserByType/:role", getUserByType);
router.get("/getFullUserData/:id", getFulldata);
router.get("/getLastActiveTime/:userId", getLastActiveTime);
router.delete("/deleteUser/:userId/:userName", deleteUser);
router.patch("/updateUser", updateUser);

export default router;