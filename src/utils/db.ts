import mongoose from "mongoose";
import { Config } from "../config";
import { categoryAndTemplateSeed } from "../seeder/categoryAndTemplate.seeder";
import { planSeed } from "../seeder/plan.seeder";
import { adminSeed } from "../seeder/admin.seeder";

export const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    await mongoose.connect(Config.MONGO_DB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    await categoryAndTemplateSeed();
    await planSeed();
    await adminSeed();
  } catch (err) {
    console.error("❌ MongoDB initial connection error:", err);
    process.exit(1);
  }
};
