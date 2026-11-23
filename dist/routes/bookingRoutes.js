"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/checkout", auth_1.verifyToken, bookingController_1.createCheckout);
router.post("/confirm", auth_1.verifyToken, bookingController_1.confirmBooking);
router.get("/my", auth_1.verifyToken, bookingController_1.getMyBookings);
router.get("/owner", auth_1.verifyToken, (0, auth_1.verifyRole)("owner", "admin"), bookingController_1.getOwnerBookings);
router.get("/all", auth_1.verifyToken, (0, auth_1.verifyRole)("admin"), bookingController_1.getAllBookings);
router.put("/:id/cancel", auth_1.verifyToken, bookingController_1.cancelBooking);
exports.default = router;
