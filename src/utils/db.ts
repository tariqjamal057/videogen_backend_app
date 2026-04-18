import mongoose from "mongoose";
import { Config } from "../config";
import { categoryAndTemplateSeed } from "../seeder/categoryAndTemplate.seeder";
import { planSeed } from "../seeder/plan.seeder";
import { adminSeed } from "../seeder/admin.seeder";

export const connectDB = async () => {
  try {
    await mongoose.connect(Config.MONGO_DB_URI);
    await categoryAndTemplateSeed();
    await planSeed();
    await adminSeed();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
