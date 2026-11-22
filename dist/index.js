"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server er main file
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cron_1 = require("./utils/cron");
(0, cron_1.startCron)();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.get("/", (req, res) => {
    res.send("GearNest server is running");
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/equipment", equipmentRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/favorites", favoriteRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
