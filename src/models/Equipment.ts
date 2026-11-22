// equipment er schema
import mongoose, { Document, Schema } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  rentalPrice: number;
  availableQuantity: number;
  rentalType: string;
  brand: string;
  model: string;
  condition: string;
  terms: string;
  image: string;
  location: string;
  availability: boolean;
  status: string;
  owner: mongoose.Types.ObjectId;
}

const equipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    rentalPrice: { type: Number, default: 0 },
    availableQuantity: { type: Number, default: 1 },
    rentalType: { type: String, default: 'Daily' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    condition: { type: String, default: 'Good' },
    terms: { type: String, default: '' },
    image: { type: String, default: '' },
    location: { type: String, default: 'Dhaka' },
    availability: { type: Boolean, default: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Equipment = mongoose.model<IEquipment>('Equipment', equipmentSchema);
export default Equipment;
