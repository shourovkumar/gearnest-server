// analytics er route
import express from "express";
import { getAdminAnalytics, getOwnerAnalytics } from "../controllers/analyticsController";
import { verifyRole, verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/admin", verifyToken, verifyRole("admin"), getAdminAnalytics);
router.get("/owner", verifyToken, verifyRole("owner", "admin"), getOwnerAnalytics);

export default router;
