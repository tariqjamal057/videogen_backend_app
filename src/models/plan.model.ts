import mongoose, { Document, Schema } from "mongoose";

export interface IPlan extends Document {
  name: string;
  bulletPoints: string[];
  credits: number;
  amount: number;
  playStorePlanId: string;
  bestValue: boolean;
  mostPopular: boolean;
  isDeleted?: boolean;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: { type: String, required: false },
    bulletPoints: [{ type: String, required: false }],
    credits: { type: Number, required: false },
    amount: { type: Number, required: false },
    mostPopular: { type: Boolean, default: false },
    bestValue: { type: Boolean, default: false },
    playStorePlanId: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

PlanSchema.index({ auth_id: 1 });

export const Plan = mongoose.model<IPlan>("Plan", PlanSchema);
