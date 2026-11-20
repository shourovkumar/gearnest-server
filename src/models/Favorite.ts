// favorite - DB te save hobe
import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  equipment: mongoose.Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    equipment: { type: Schema.Types.ObjectId, ref: "Equipment", required: true },
  },
  { timestamps: true }
);

const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
export default Favorite;
