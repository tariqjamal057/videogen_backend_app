import mongoose, { Document, Schema } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  description: string;
  prompt: string;
  image: string;
  inputType: string;
  templateType: string;
  categoryId: mongoose.Types.ObjectId;
  noOfInput: number;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    categoryId: { type: mongoose.Types.ObjectId, ref: "Category" },
    name: { type: String, required: false },
    description: { type: String, required: false },
    prompt: { type: String, required: false },
    image: { type: String, required: false },
    inputType: { type: String, required: false, default: "image" },
    templateType: { type: String, required: false, default: "video" },
    noOfInput: { type: Number, required: false, default: 1 },
  },
  {
    timestamps: true,
  }
);

TemplateSchema.index({ auth_id: 1 });

export const Template = mongoose.model<ITemplate>("Template", TemplateSchema);
