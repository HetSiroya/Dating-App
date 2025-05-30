import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";

interface admin {
  _id: any;
  name: string;
  email: string;
  isApproved : boolean
}

function generateTokenAdmin(admin: admin): string {
  let jwtSecret: string = process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key";
  const token: string = jwt.sign(admin, jwtSecret);
  return token;
}

export default generateTokenAdmin;
