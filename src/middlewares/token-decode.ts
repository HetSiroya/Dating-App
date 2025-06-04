import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();
import dotenv from "dotenv";
import { userModel } from "../model/user/userModel";
import { adminModel } from "../model/admin/adminModel";

export const SECRET_KEY: Secret =
  process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key";

export interface TokenPayload extends JwtPayload {
  _id: string;
  email: string;
}
export interface CustomRequest extends Request {
  user?: any;
  filePaths?: {
    [key: string]: string;
  };
}

export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Token missing");
    }

    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
    if (!decoded) {
      throw new Error("Invalid token");
    }
    const user = await userModel.findById(decoded._id);
    const admin = await adminModel.findById(decoded._id);

    if (!user && !admin) {
      throw new Error("User not found");
    }
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).send("Please authenticate");
  }
};
