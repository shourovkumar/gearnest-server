"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFavorite = exports.getMyFavorites = exports.removeFavorite = exports.addFavorite = void 0;
const Favorite_1 = __importDefault(require("../models/Favorite"));
const addFavorite = async (req, res) => {
    try {
        const { equipmentId } = req.body;
        const old = await Favorite_1.default.findOne({ user: req.user._id, equipment: equipmentId });
        if (old)
            return res.json({ message: "Already in favorites" });
        const fav = new Favorite_1.default({ user: req.user._id, equipment: equipmentId });
        await fav.save();
        res.status(201).json({ message: "Added to favorites", fav });
    }
    catch (error) {
        res.status(500).json({ message: "Add failed" });
    }
};
exports.addFavorite = addFavorite;
const removeFavorite = async (req, res) => {
    try {
        await Favorite_1.default.findOneAndDelete({ user: req.user._id, equipment: req.params.id });
        res.json({ message: "Removed from favorites" });
    }
    catch (error) {
        res.status(500).json({ message: "Remove failed" });
    }
};
exports.removeFavorite = removeFavorite;
const getMyFavorites = async (req, res) => {
    try {
        const favs = await Favorite_1.default.find({ user: req.user._id }).populate("equipment");
        res.json({ favorites: favs });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getMyFavorites = getMyFavorites;
const checkFavorite = async (req, res) => {
    try {
        const fav = await Favorite_1.default.findOne({ user: req.user._id, equipment: req.params.id });
        res.json({ isFavorite: !!fav });
    }
    catch (error) {
        res.json({ isFavorite: false });
    }
};
exports.checkFavorite = checkFavorite;
