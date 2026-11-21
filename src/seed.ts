// demo user banano - live site er jonno
import dotenv from "dotenv";
import connectDB from "./config/db";
import User from "./models/User";

dotenv.config();

const run = async () => {
  await connectDB();
  const users = [
    { name: "Admin", email: "admin@gearnest.com", password: "Admin123!", role: "admin", photo: "" },
    { name: "Owner", email: "owner@gearnest.com", password: "Owner123!", role: "owner", photo: "" },
    { name: "Customer", email: "customer@gearnest.com", password: "Customer123!", role: "customer", photo: "" },
  ];
  for (const u of users) {
    const old = await User.findOne({ email: u.email });
    if (!old) {
      await new User(u).save();
      console.log("Created:", u.email);
    } else {
      console.log("Already exists:", u.email);
    }
  }
  console.log("Seed done");
  process.exit(0);
};

run();
