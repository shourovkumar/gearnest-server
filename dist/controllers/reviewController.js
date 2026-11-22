"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyReviews = exports.getReviews = exports.createReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
// review dewa
const createReview = async (req, res) => {
    try {
        const { equipmentId, rating, comment } = req.body;
        const review = new Review_1.default({
            equipment: equipmentId,
            user: req.user._id,
            rating,
            comment,
        });
        await review.save();
        res.status(201).json({ message: "Review added", review });
    }
    catch (error) {
        res.status(500).json({ message: "Review failed" });
    }
};
exports.createReview = createReview;
// ekta equipment er sob review dekha
const getReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ equipment: req.params.equipmentId })
            .populate("user", "name")
            .sort({ createdAt: -1 });
        res.json({ reviews });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getReviews = getReviews;
// amar review gula - customer dashboard er My Reviews er jonno
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review_1.default.find({ user: req.user._id })
            .populate("equipment", "name")
            .sort({ createdAt: -1 });
        res.json({ reviews });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getMyReviews = getMyReviews;
