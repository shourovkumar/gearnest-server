// booking + stripe - video er flow
import { Response } from "express";
import Stripe from "stripe";
import { AuthRequest } from "../middleware/auth";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";
import Payment from "../models/Payment";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string)
  : null;

// total hisab - Daily / Weekly / Monthly + quantity
const calcTotal = (price: number, type: string, start: Date, end: Date, qty: number) => {
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  let unit = days;
  if (type === "Weekly") unit = Math.ceil(days / 7);
  if (type === "Monthly") unit = Math.ceil(days / 30);
  return price * unit * qty;
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, startDate, endDate, quantity, contact, address, notes } = req.body;
    const equipment: any = await Equipment.findById(equipmentId);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });
    if (equipment.availableQuantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    const total = calcTotal(equipment.rentalPrice, equipment.rentalType, new Date(startDate), new Date(endDate), quantity);

    const booking = new Booking({
      equipment: equipmentId,
      customer: req.user._id,
      owner: equipment.owner,
      startDate,
      endDate,
      quantity,
      contact,
      address,
      notes,
      totalAmount: total,
      paymentStatus: "Unpaid",
      bookingStatus: "Pending",
    });
    await booking.save();

    // stripe key na thakle direct success a pathabo - test er jonno
    if (!stripe) {
      return res.json({ booking, url: `/payment-success?bookingId=${booking._id}` });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: equipment.name },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/equipment/${equipmentId}`,
      metadata: { bookingId: booking._id.toString() },
    });

    res.json({ booking, url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Booking failed" });
  }
};

// payment success er por - Paid korbo
export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking: any = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.transactionId = "txn_" + Date.now();
    await booking.save();

    const payment = new Payment({
      booking: booking._id,
      customer: booking.customer,
      amount: booking.totalAmount,
      transactionId: booking.transactionId,
      status: "Paid",
    });
    await payment.save();

    // quantity komabo
    await Equipment.findByIdAndUpdate(booking.equipment, { $inc: { availableQuantity: -booking.quantity } });

    res.json({ message: "Payment successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Confirm failed" });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).populate("equipment").populate("owner", "name email").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id }).populate("equipment").populate("customer", "name email phone").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find().populate("equipment").populate("customer", "name email").populate("owner", "name email").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
