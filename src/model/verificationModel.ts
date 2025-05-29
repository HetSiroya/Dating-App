import express from "express";
import mongoose, { model } from "mongoose";

interface iVerification {
  mobileNumber: number;
  email: string;
  otp: number;
}

const verifcationSchema = new mongoose.Schema<iVerification>({
  mobileNumber: {
    type: Number,
  },
  email: {
    type: String,
  },
  otp: {
    type: Number,
    required: true,
  },
});

const verificationModel = model<iVerification>("Verify", verifcationSchema);
export default verificationModel;
