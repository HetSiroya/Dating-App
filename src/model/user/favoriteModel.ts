import { Types, Document } from "mongoose";
import { Schema, model } from "mongoose";

export interface IFavorite extends Document {
  to: Types.ObjectId;
  by: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
const favoriteSchema = new Schema<IFavorite>(
  {
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const favoriteModel = model<IFavorite>("Favorite", favoriteSchema);

export default favoriteModel;
