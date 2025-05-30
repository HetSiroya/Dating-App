import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface for Admin
export interface IAdmin extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  isApproved: boolean;
  isDeleted: boolean;
}

// Mongoose schema for Admin
const adminSchema: Schema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, require: true, default: false },
  isDeleted: { type: Boolean, default: false },
});

export const adminModel = mongoose.model<IAdmin>("Admin", adminSchema);
