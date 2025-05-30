import mongoose, { Document, Mongoose, Schema } from "mongoose";

interface IPlan {
  addedBy: mongoose.Schema.Types.ObjectId;
  planeName: string;
  detail: string;
  price: number;
  status: string;
}

const planeSchema = new Schema<IPlan>({
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admins",
    required: true,
  },
  planeName: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "active",
    required: true,
  },
});

export const planeModel = mongoose.model<IPlan>("Plan", planeSchema);
