import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  templateId: mongoose.Types.ObjectId | null;
  userId: mongoose.Types.ObjectId;
  prompt: string;
  inputImages: string[];
  progress: number;
  uuid: string;
  url: string | null;
  gifUrl: string | null;
  status: number;
}

const VideoSchema = new Schema<IVideo>(
  {
    templateId: { type: mongoose.Types.ObjectId, ref: "Template", required: false },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    prompt: { type: String, required: false },
    inputImages: [{ type: String, required: false }],
    progress: { type: Number, required: false },
    uuid: { type: String, required: true },
    url: { type: String, required: false },
    gifUrl: { type: String, required: false },
    status: { type: Number, required: false, default: 1 }, // 1 --> pending, 2 --> generated and 3 --> failed
  },
  {
    timestamps: true,
  }
);

VideoSchema.index({ auth_id: 1 });

export const Video = mongoose.model<IVideo>("Video", VideoSchema);
