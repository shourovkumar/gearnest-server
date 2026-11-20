// demo user bananor jonno - 1 bar chalaba
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  await User.deleteMany({ email: { $in: ["admin@gearnest.com", "owner@gearnest.com", "customer@gearnest.com"] } });

  await User.create([
    { name: "Admin", email: "admin@gearnest.com", password: "Admin123!", role: "admin" },
    { name: "Owner", email: "owner@gearnest.com", password: "Owner123!", role: "owner" },
    { name: "Customer", email: "customer@gearnest.com", password: "Customer123!", role: "customer" },
  ]);
  console.log("Demo users created");
  process.exit(0);
};
run();
