// booking er route gulo
import express from "express";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
} from "../controllers/bookingController";
import { verifyRole, verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken, verifyRole("customer"), createBooking);
router.get("/my", verifyToken, getMyBookings);
router.get("/owner", verifyToken, verifyRole("owner", "admin"), getOwnerBookings);
router.get("/", verifyToken, verifyRole("admin"), getAllBookings);
router.put("/:id/status", verifyToken, updateBookingStatus);
router.put("/:id/cancel", verifyToken, cancelBooking);

export default router;

