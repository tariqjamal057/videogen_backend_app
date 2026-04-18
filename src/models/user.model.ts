import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture: string;
  authId: string;
  credits: number;
  createdAt?: Date;
  updatedAt?: Date;
  isSuspended: boolean;
  deletedAt?: Date;
  isDeleted?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    profilePicture: { type: String, required: false },
    authId: { type: String, required: false },
    credits: { type: Number, default: 0 },
    deletedAt: { type: Date, required: false },
    isDeleted: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ auth_id: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
