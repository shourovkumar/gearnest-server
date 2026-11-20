// review er route
import express from "express";
import { createReview, getReviews } from "../controllers/reviewController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.get("/:equipmentId", getReviews);

export default router;
