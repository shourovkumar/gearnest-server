// favorite add / remove / amar list
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Favorite from "../models/Favorite";

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId } = req.body;
    const old = await Favorite.findOne({ user: req.user._id, equipment: equipmentId });
    if (old) return res.json({ message: "Already in favorites" });
    const fav = new Favorite({ user: req.user._id, equipment: equipmentId });
    await fav.save();
    res.status(201).json({ message: "Added to favorites", fav });
  } catch (error) {
    res.status(500).json({ message: "Add failed" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, equipment: req.params.id });
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: "Remove failed" });
  }
};

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favs = await Favorite.find({ user: req.user._id }).populate("equipment");
    res.json({ favorites: favs });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const fav = await Favorite.findOne({ user: req.user._id, equipment: req.params.id });
    res.json({ isFavorite: !!fav });
  } catch (error) {
    res.json({ isFavorite: false });
  }
};
