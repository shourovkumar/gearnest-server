"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCron = void 0;
// cron - protidin rat 12 tay check korbe, end date par hole Completed
const node_cron_1 = __importDefault(require("node-cron"));
const Booking_1 = __importDefault(require("../models/Booking"));
const startCron = () => {
    node_cron_1.default.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();
            await Booking_1.default.updateMany({ endDate: { $lt: now }, bookingStatus: "Confirmed" }, { $set: { bookingStatus: "Completed" } });
            console.log("Cron: booking status updated");
        }
        catch (error) {
            console.log("Cron error:", error);
        }
    });
};
exports.startCron = startCron;
