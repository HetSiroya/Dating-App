import mongoose, { model, Schema } from "mongoose";

interface ILike {
  by: mongoose.Schema.Types.ObjectId;
  to: mongoose.Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
  {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const likeModel = model<ILike>("Like", likeSchema);
