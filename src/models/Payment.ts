// payment er record - stripe er jonno
import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  amount: number;
  transactionId: string;
  status: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, default: "" },
    status: { type: String, default: "Paid" },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
