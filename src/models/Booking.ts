// booking er full schema - video er moto
import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  equipment: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  quantity: number;
  contact: string;
  address: string;
  notes: string;
  totalAmount: number;
  paymentStatus: "Unpaid" | "Paid";
  bookingStatus: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  transactionId: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    equipment: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    quantity: { type: Number, default: 1 },
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    notes: { type: String, default: "" },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    bookingStatus: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" },
    transactionId: { type: String, default: "" },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
