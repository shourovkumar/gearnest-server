"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// review er route
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", auth_1.verifyToken, reviewController_1.createReview);
// my reviews - eita age, naile /:equipmentId er sathe conflict hobe
router.get("/my", auth_1.verifyToken, reviewController_1.getMyReviews);
router.get("/:equipmentId", reviewController_1.getReviews);
exports.default = router;
