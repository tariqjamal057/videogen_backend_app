import mongoose, { Document, Schema } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  prompt: string;
  image: string;
  inputType: string;
  templateType: string;
  categoryId: mongoose.Types.ObjectId;
  noOfInput: number;
  isPrimary: boolean;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
    name: { type: String, required: false },
    prompt: { type: String, required: false },
    image: { type: String, required: false },
    inputType: { type: String, required: false, default: "image" },
    templateType: { type: String, required: false, default: "video" },
    noOfInput: { type: Number, required: false, default: 1 },
    isPrimary: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

TemplateSchema.index({ auth_id: 1 });

export const Template = mongoose.model<ITemplate>("Template", TemplateSchema);
