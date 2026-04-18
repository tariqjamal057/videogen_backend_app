import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  planId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | undefined;
  transactionId: string;
  amount: number;
  credits: number;
  paymentId?: string;
  status: number;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    planId: { type: mongoose.Types.ObjectId, ref: "Plan", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    paymentId: { type: String, required: false },
    status: { type: Number, default: 1 }, // 1: Pending, 2: Completed, 3: Failed
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ auth_id: 1 });

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
