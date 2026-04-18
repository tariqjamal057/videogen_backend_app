import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  isDeleted?: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ auth_id: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
