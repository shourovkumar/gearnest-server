// review er logic
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Review from "../models/Review";

// review dewa
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, rating, comment } = req.body;
    const review = new Review({
      equipment: equipmentId,
      user: req.user._id,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: "Review failed" });
  }
};

// ekta equipment er sob review dekha
export const getReviews = async (req: any, res: Response) => {
  try {
    const reviews = await Review.find({ equipment: req.params.equipmentId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// amar review gula - customer dashboard er My Reviews er jonno
export const getMyReviews = async (req: AuthRequest, res: Response) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("equipment", "name")
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
