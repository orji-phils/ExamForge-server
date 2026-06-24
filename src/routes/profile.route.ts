import * as express from "express";
import { createProfile, deleteProfile, getProfile } from "../controllers/profile.controller";
import { uploadProfile } from "../service/utility/pictureFileUpload";
import { multerErrorHandler } from "../middleWares/errors.middleware";
import { verifyToken } from "../middleWares/verifyToken";
import { updateLastActiveTime } from "../controllers/user.controller";

const router = express.Router();

router.use(verifyToken);
router.use(updateLastActiveTime);
router.get("/getProfile", getProfile);
router.delete("/deleteprofile", deleteProfile);
router.put("/uploadProfile", uploadProfile.single("profilePicture"), createProfile);

export default router;