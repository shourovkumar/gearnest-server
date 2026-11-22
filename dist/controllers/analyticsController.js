"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerAnalytics = exports.getAdminAnalytics = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Equipment_1 = __importDefault(require("../models/Equipment"));
const User_1 = __importDefault(require("../models/User"));
const getAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalEquipment = await Equipment_1.default.countDocuments();
        const totalBookings = await Booking_1.default.countDocuments();
        const pendingApprovals = await Equipment_1.default.countDocuments({ status: "Pending" });
        const completed = await Booking_1.default.countDocuments({ bookingStatus: "Completed" });
        const paidBookings = await Booking_1.default.find({ paymentStatus: "Paid" });
        const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);
        // monthly - last 6 month
        const monthly = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            const count = await Booking_1.default.countDocuments({ createdAt: { $gte: start, $lt: end } });
            monthly.push({ month: d.toLocaleString("en", { month: "short" }), bookings: count });
        }
        res.json({ totalUsers, totalEquipment, totalBookings, pendingApprovals, completed, totalRevenue, monthly });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getAdminAnalytics = getAdminAnalytics;
const getOwnerAnalytics = async (req, res) => {
    try {
        const myEq = await Equipment_1.default.find({ owner: req.user._id });
        const eqIds = myEq.map((e) => e._id);
        const bookings = await Booking_1.default.find({ equipment: { $in: eqIds } });
        const totalEarnings = bookings.filter((b) => b.paymentStatus === "Paid").reduce((sum, b) => sum + b.totalAmount, 0);
        const monthly = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
            const list = await Booking_1.default.find({ equipment: { $in: eqIds }, createdAt: { $gte: start, $lt: end }, paymentStatus: "Paid" });
            const earning = list.reduce((sum, b) => sum + b.totalAmount, 0);
            monthly.push({ month: d.toLocaleString("en", { month: "short" }), earnings: earning });
        }
        res.json({ totalEquipment: myEq.length, totalBookings: bookings.length, totalEarnings, monthly });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getOwnerAnalytics = getOwnerAnalytics;
