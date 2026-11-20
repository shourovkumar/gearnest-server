// review er schema
import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  equipment: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    equipment: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
