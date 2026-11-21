// review er route
import express from "express";
import { createReview, getMyReviews, getReviews } from "../controllers/reviewController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, createReview);
// my reviews - eita age, naile /:equipmentId er sathe conflict hobe
router.get("/my", verifyToken, getMyReviews);
router.get("/:equipmentId", getReviews);

export default router;
