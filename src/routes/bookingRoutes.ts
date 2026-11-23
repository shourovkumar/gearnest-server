import express from "express";
import { cancelBooking, confirmBooking, createCheckout, getAllBookings, getMyBookings, getOwnerBookings } from "../controllers/bookingController";
import { verifyRole, verifyToken } from "../middleware/auth";

const router = express.Router();
router.post("/checkout", verifyToken, createCheckout);
router.post("/confirm", verifyToken, confirmBooking);
router.get("/my", verifyToken, getMyBookings);
router.get("/owner", verifyToken, verifyRole("owner", "admin"), getOwnerBookings);
router.get("/all", verifyToken, verifyRole("admin"), getAllBookings);
router.put("/:id/cancel", verifyToken, cancelBooking);
export default router;
