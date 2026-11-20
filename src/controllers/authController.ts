// register ar login er logic ekhane
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// token banano
const makeToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "Email already used" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = makeToken(user._id.toString(), user.role);
    res.status(201).json({
      message: "Register success",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Register failed" });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = makeToken(user._id.toString(), user.role);
    res.json({
      message: "Login success",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// nijer profile dekha
export const getMe = async (req: any, res: Response) => {
  res.json({ user: req.user });
};
