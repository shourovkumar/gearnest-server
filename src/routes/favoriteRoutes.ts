// favorite er route
import express from "express";
import { addFavorite, checkFavorite, getMyFavorites, removeFavorite } from "../controllers/favoriteController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();
router.post("/", verifyToken, addFavorite);
router.get("/my", verifyToken, getMyFavorites);
router.get("/check/:id", verifyToken, checkFavorite);
router.delete("/:id", verifyToken, removeFavorite);
export default router;
