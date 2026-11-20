// equipment er schema
import mongoose, { Document, Schema } from "mongoose";

export interface IEquipment extends Document {
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  image: string;
  location: string;
  availability: boolean;
  owner: mongoose.Types.ObjectId;
}

const equipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String, default: "" },
    location: { type: String, default: "Dhaka" },
    availability: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Equipment = mongoose.model<IEquipment>("Equipment", equipmentSchema);
export default Equipment;
