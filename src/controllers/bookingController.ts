// booking er logic ekhane
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";

// notun booking kora - sudhu customer
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    if (!equipment.availability) {
      return res.status(400).json({ message: "Equipment not available" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (totalDays <= 0) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const oldBooking = await Booking.findOne({
      equipment: equipmentId,
      status: { $in: ["pending", "confirmed"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
    if (oldBooking) {
      return res.status(400).json({ message: "Already booked for these dates" });
    }

    const totalPrice = totalDays * equipment.pricePerDay;

    const booking = new Booking({
      equipment: equipmentId,
      customer: req.user._id,
      owner: equipment.owner,
      startDate: start,
      endDate: end,
      totalDays,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (error) {
    console.log("Booking error:", error);
    res.status(500).json({ message: "Booking failed" });
  }
};

// amar booking gulo - customer er jonno
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate("equipment")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// owner er kache kara booking korse
export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("equipment")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// sob booking - admin er jonno
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("equipment")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// booking er status change kora - owner / admin
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You have no permission" });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: "Status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// booking cancel kora - customer
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You have no permission" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};
