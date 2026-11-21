import express from "express";
import { changeRole, getAllUsers } from "../controllers/userController";
import { verifyRole, verifyToken } from "../middleware/auth";

const router = express.Router();
router.get("/", verifyToken, verifyRole("admin"), getAllUsers);
router.put("/:id/role", verifyToken, verifyRole("admin"), changeRole);
export default router;
