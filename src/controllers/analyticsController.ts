// admin + owner analytics - chart er jonno
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";
import User from "../models/User";

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEquipment = await Equipment.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Equipment.countDocuments({ status: "Pending" });
    const completed = await Booking.countDocuments({ bookingStatus: "Completed" });
    const paidBookings = await Booking.find({ paymentStatus: "Paid" });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // monthly - last 6 month
    const monthly: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = await Booking.countDocuments({ createdAt: { $gte: start, $lt: end } });
      monthly.push({ month: d.toLocaleString("en", { month: "short" }), bookings: count });
    }
    res.json({ totalUsers, totalEquipment, totalBookings, pendingApprovals, completed, totalRevenue, monthly });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const getOwnerAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const myEq = await Equipment.find({ owner: req.user._id });
    const eqIds = myEq.map((e) => e._id);
    const bookings = await Booking.find({ equipment: { $in: eqIds } });
    const totalEarnings = bookings.filter((b) => b.paymentStatus === "Paid").reduce((sum, b) => sum + b.totalAmount, 0);

    const monthly: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const list = await Booking.find({ equipment: { $in: eqIds }, createdAt: { $gte: start, $lt: end }, paymentStatus: "Paid" });
      const earning = list.reduce((sum, b) => sum + b.totalAmount, 0);
      monthly.push({ month: d.toLocaleString("en", { month: "short" }), earnings: earning });
    }
    res.json({ totalEquipment: myEq.length, totalBookings: bookings.length, totalEarnings, monthly });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
