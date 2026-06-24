import * as express from "express";
import { activateAccount, deactivateAccount, resendToken } from "../controllers/activation.controller";
import { verifyToken } from "../middleWares/verifyToken";
import { updateLastActiveTime } from "../controllers/user.controller";

const router = express.Router();

router.get("/resendActivationtoken/:email", resendToken);
router.patch("/activateAccount", activateAccount);

router.use(verifyToken);
router.use(updateLastActiveTime);
router.patch("/suspend/:userId/:userName", deactivateAccount);

export default router;