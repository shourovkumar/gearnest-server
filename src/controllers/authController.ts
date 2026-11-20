// auth er sob logic - password check + google
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";

// password check - uppercase + lowercase + 6+
const checkPassword = (pass: string) => {
  if (pass.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(pass)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(pass)) return "Password must have a lowercase letter";
  return "";
};

const makeToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "gearnest-secret",
    { expiresIn: "7d" }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, photo, password, role } = req.body;
    const errMsg = checkPassword(password);
    if (errMsg) return res.status(400).json({ message: errMsg });

    const old = await User.findOne({ email });
    if (old) return res.status(400).json({ message: "Email already used" });

    const user = new User({ name, email, photo, password, role: role || "customer" });
    await user.save();
    const token = makeToken(user);
    res.status(201).json({ message: "Registration successful", token, user: { _id: user._id, name, email, photo, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Register failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });
    const token = makeToken(user);
    res.json({ message: "Login successful", token, user: { _id: user._id, name: user.name, email, photo: user.photo, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// google login - default customer
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { name, email, photo } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, photo, password: "Google123", role: "customer" });
      await user.save();
    }
    const token = makeToken(user);
    res.json({ message: "Google login successful", token, user: { _id: user._id, name: user.name, email, photo: user.photo, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Google login failed" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, photo, phone, address } = req.body;
    const updated = await User.findByIdAndUpdate(req.user._id, { name, photo, phone, address }, { new: true });
    res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
