import express from "express";
import mongoose, { Schema } from "mongoose";
import { ref } from "process";

interface IPlan {
  userId: mongoose.Schema.Types.ObjectId;
  planId: mongoose.Schema.Types.ObjectId;
}

const purchaseSchema = new Schema<IPlan>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "plans",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const purchaseModel = mongoose.model<IPlan>("purchase", purchaseSchema);
export default purchaseModel;
