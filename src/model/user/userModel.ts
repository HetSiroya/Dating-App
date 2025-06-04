import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture: string;
  mobileNumber: number;
  birthDate: string;
  age: number;
  gender: mongoose.Schema.Types.ObjectId;
  intrestedthings: mongoose.Schema.Types.ObjectId[];
  attract: mongoose.Schema.Types.ObjectId;
  isProfileCompleted: boolean;
  location: {
    city: string;
    latitude: number;
    longitude: number;
  };
  isPremium: boolean;
}

// Mongoose schema for User
const UserSchema: Schema = new Schema<IUser>({
  profilePicture: { type: String, default: "" },
  name: { type: String, default: "" },
  email: { type: String, unique: true },
  mobileNumber: { type: Number, default: null },
  birthDate: { type: String, default: "" },
  age: { type: Number, min: 18 },
  gender: { type: mongoose.Schema.Types.ObjectId, ref: "Gender" },
  intrestedthings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Interest" }],
  attract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genders",
  },
  location: {
    city: { type: String, default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  isProfileCompleted: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
