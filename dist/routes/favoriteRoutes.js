"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// favorite er route
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.verifyToken, favoriteController_1.addFavorite);
router.get("/my", auth_1.verifyToken, favoriteController_1.getMyFavorites);
router.get("/check/:id", auth_1.verifyToken, favoriteController_1.checkFavorite);
router.delete("/:id", auth_1.verifyToken, favoriteController_1.removeFavorite);
exports.default = router;
