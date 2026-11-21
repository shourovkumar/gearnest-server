// sob user + role change - admin er jonno
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const changeRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    res.json({ message: "Role updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
