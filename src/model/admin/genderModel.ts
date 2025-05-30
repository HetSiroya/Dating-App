import mongoose, { Schema, model, Document } from "mongoose";

interface IGender {
  gender: string;
  addedBy: mongoose.Schema.Types.ObjectId;
}

// Example Mongoose model (if using Mongoose)


const genderSchema = new Schema<IGender>({
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  addedBy: {
    type: String,
    required: true,
  },
});

export const genderModel = model<IGender>("Gender", genderSchema);
