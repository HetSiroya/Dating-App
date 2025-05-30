import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  profilePicture: string;
  mobilenumber: number;
  birthDate: string;
  age: number;
  gender: mongoose.Schema.Types.ObjectId;
  intrestedthings: string[];
  isProfileCompleted: boolean;
  isPremium: boolean;
}

// Mongoose schema for User
const UserSchema: Schema = new Schema<IUser>({
  profilePicture: { type: String, default: "" },
  name: { type: String, default: "" },
  email: { type: String, unique: true, default: "" },
  mobilenumber: { type: Number, unique: true },
  birthDate: { type: String, default: "" },
  age: { type: Number, min: 18 },
  gender: { type: mongoose.Schema.Types.ObjectId  },
  intrestedthings: { type: [String], default: [] },
  isProfileCompleted: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
