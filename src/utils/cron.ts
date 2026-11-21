// cron - protidin rat 12 tay check korbe, end date par hole Completed
import cron from "node-cron";
import Booking from "../models/Booking";

export const startCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      await Booking.updateMany(
        { endDate: { $lt: now }, bookingStatus: "Confirmed" },
        { $set: { bookingStatus: "Completed" } }
      );
      console.log("Cron: booking status updated");
    } catch (error) {
      console.log("Cron error:", error);
    }
  });
};
