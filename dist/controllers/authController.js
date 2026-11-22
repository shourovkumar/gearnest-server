"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.googleLogin = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// password check - uppercase + lowercase + 6+
const checkPassword = (pass) => {
    if (pass.length < 6)
        return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pass))
        return "Password must have an uppercase letter";
    if (!/[a-z]/.test(pass))
        return "Password must have a lowercase letter";
    return "";
};
const makeToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || "gearnest-secret", { expiresIn: "7d" });
};
const register = async (req, res) => {
    try {
        const { name, email, photo, password, role } = req.body;
        const errMsg = checkPassword(password);
        if (errMsg)
            return res.status(400).json({ message: errMsg });
        const old = await User_1.default.findOne({ email });
        if (old)
            return res.status(400).json({ message: "Email already used" });
        const user = new User_1.default({ name, email, photo, password, role: role || "customer" });
        await user.save();
        const token = makeToken(user);
        res.status(201).json({ message: "Registration successful", token, user: { _id: user._id, name, email, photo, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Register failed" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // FIX: IUser a photo nai, tai any diye nilam - naile TS2339 error dey Render a
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });
        const ok = await user.comparePassword(password);
        if (!ok)
            return res.status(400).json({ message: "Wrong password" });
        const token = makeToken(user);
        res.json({ message: "Login successful", token, user: { _id: user._id, name: user.name, email, photo: user.photo, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};
exports.login = login;
// google login - default customer
const googleLogin = async (req, res) => {
    try {
        const { name, email, photo } = req.body;
        // FIX: same - photo er jonno any
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = new User_1.default({ name, email, photo, password: "Google123", role: "customer" });
            await user.save();
        }
        const token = makeToken(user);
        res.json({ message: "Google login successful", token, user: { _id: user._id, name: user.name, email, photo: user.photo, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ message: "Google login failed" });
    }
};
exports.googleLogin = googleLogin;
const getMe = async (req, res) => {
    res.json({ user: req.user });
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const { name, photo, phone, address } = req.body;
        const updated = await User_1.default.findByIdAndUpdate(req.user._id, { name, photo, phone, address }, { new: true });
        res.json({ message: "Profile updated", user: updated });
    }
    catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};
exports.updateProfile = updateProfile;
