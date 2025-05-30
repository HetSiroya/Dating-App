import mongoose, { Document, Mongoose, Schema } from "mongoose";

interface IIntrest {
  addedBy: mongoose.Schema.Types.ObjectId;
  intrestName: string;
  status : string
}

const intrestSchema = new mongoose.Schema<IIntrest>({
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
  intrestName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "active",
  },
});

export const intrestModel = mongoose.model<IIntrest>("intrest", intrestSchema);
