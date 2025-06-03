import mongoose, { model, Schema, Types } from "mongoose";

interface IMatch {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
}

const matchSchema = new mongoose.Schema<IMatch>(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const matchModel = model<IMatch>("match", matchSchema);
