// server er main file
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import equipmentRoutes from "./routes/equipmentRoutes";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("GearNest server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
