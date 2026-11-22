// booking + stripe - video er flow
import { Response } from 'express';
import Stripe from "stripe";
import { AuthRequest } from "../middleware/auth";
import Booking from "../models/Booking";
import Equipment from "../models/Equipment";
import Payment from "../models/Payment";
import { sendBookingEmail } from "../utils/sendEmail";

// FIX: stripe ke upore banale .env load howar agei null hoye jay
// Tai ekhon protibar checkout er vitore banabo

// total hisab - Daily / Weekly / Monthly + quantity
const calcTotal = (price: number, type: string, start: Date, end: Date, qty: number) => {
  const safePrice = Number(price) || 0;
  const safeQty = Number(qty) || 1;
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  let unit = days;
  if (type === "Weekly") unit = Math.ceil(days / 7);
  if (type === "Monthly") unit = Math.ceil(days / 30);
  return safePrice * unit * safeQty;
};

// FIX: price fallback - 0 ke valid dhora jabe na, prothom > 0 dam ta nibo
const getUnitPrice = (equipment: any): number => {
  const candidates = [
    Number(equipment.rentalPrice || 0),
    Number(equipment.pricePerDay || 0),
    Number(equipment.price || 0),
  ];
  for (const p of candidates) {
    if (p && !isNaN(p) && p > 0) return p;
  }
  return 0;
};

export const createCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { equipmentId, startDate, endDate, quantity, contact, address, notes } = req.body;
    const qty = Number(quantity) || 1;

    const equipment: any = await Equipment.findById(equipmentId);
    if (!equipment) return res.status(404).json({ message: "Equipment not found" });
    if (equipment.availableQuantity < qty) {
      return res.status(400).json({ message: "Not enough quantity available" });
    }

    // FIX: age chilo price ?? rentalPrice ?? pricePerDay - rentalPrice 0 holei atke jeto
    // Ekhon rentalPrice 0 hole pricePerDay nibe
    const unitPrice = getUnitPrice(equipment);
    const rentalType = equipment.rentalType || equipment.type || "Daily";

    if (!unitPrice || isNaN(unitPrice)) {
      return res.status(400).json({ message: "Equipment price not found" });
    }

    const total = calcTotal(unitPrice, rentalType, new Date(startDate), new Date(endDate), qty);

    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const booking = new Booking({
      equipment: equipmentId,
      customer: req.user._id,
      owner: equipment.owner,
      startDate,
      endDate,
      quantity: qty,
      contact,
      address,
      notes,
      totalAmount: total,
      paymentStatus: "Unpaid",
      bookingStatus: "Pending",
    });
    await booking.save();

    // Stripe client ekhon ekhane banabo - .env tokhon load hoye gese
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    console.log("STRIPE CHECK:", !!stripeKey);

    // stripe key na thakle direct success a pathabo - test er jonno
    if (!stripeKey) {
      return res.json({ booking, url: `/payment-success?bookingId=${booking._id}` });
    }

    const stripe = new Stripe(stripeKey as string);

    const session = await stripe.checkout.sessions.create({
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
    const booking: any = await Booking.findById(bookingId).populate("customer", "name email").populate("equipment", "name");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "Paid") {
      return res.json({ message: "Already confirmed", booking });
    }

    booking.paymentStatus = "Paid";
    booking.bookingStatus = "Confirmed";
    booking.transactionId = "txn_" + Date.now();
    await booking.save();

    const payment = new Payment({
      booking: booking._id,
      customer: booking.customer._id,
      amount: booking.totalAmount,
      transactionId: booking.transactionId,
      status: "Paid",
    });
    await payment.save();

    await Equipment.findByIdAndUpdate(booking.equipment._id, { $inc: { availableQuantity: -booking.quantity } });

    if (booking.customer?.email) {
      await sendBookingEmail(
        booking.customer.email,
        "Booking Confirmed - GearNest",
        `Hi ${booking.customer.name}, your booking for ${booking.equipment.name} has been confirmed. Total: ${booking.totalAmount}`
      );
    }

    res.json({ message: "Payment successful", booking });
  } catch (error) {
    console.log(error);
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
