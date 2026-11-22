"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRole = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select("-password").sort({ createdAt: -1 });
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
};
exports.getAllUsers = getAllUsers;
const changeRole = async (req, res) => {
    try {
        const { role } = req.body;
        const updated = await User_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        res.json({ message: "Role updated", user: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
exports.changeRole = changeRole;
