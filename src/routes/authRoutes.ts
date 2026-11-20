import express from "express";
import { getMe, googleLogin, login, register, updateProfile } from "../controllers/authController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", verifyToken, getMe);
router.put("/profile", verifyToken, updateProfile);
export default router;
