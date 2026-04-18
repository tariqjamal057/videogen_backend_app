import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  reason: string;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    videoId: { type: mongoose.Types.ObjectId, ref: "Video" },
    reason: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>("Report", ReportSchema);
