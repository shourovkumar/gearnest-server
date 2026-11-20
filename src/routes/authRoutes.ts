// auth er route gulo
import express from "express";
import { getMe, login, register } from "../controllers/authController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);

export default router;
