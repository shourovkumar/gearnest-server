"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// booking er full schema - video er moto
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    equipment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Equipment", required: true },
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
}, { timestamps: true });
const Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = Booking;
