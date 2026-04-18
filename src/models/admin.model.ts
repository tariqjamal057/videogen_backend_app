import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

AdminSchema.index({ email: 1 });

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
