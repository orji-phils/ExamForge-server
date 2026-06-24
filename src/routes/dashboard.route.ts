import * as express from "express";
import { adminDashboard, masterDashboard, userDashboard } from "../controllers/dashboard.controller";
import { updateLastActiveTime } from "../controllers/user.controller";
import { verifyToken } from "../middleWares/verifyToken";

const router = express.Router();

router.use(verifyToken);
router.use(updateLastActiveTime)
router.get("/user", userDashboard);
router.get("/admin", adminDashboard);
router.get("/master", masterDashboard);

export default router;