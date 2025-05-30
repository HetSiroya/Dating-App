import express, { Request, Response } from "express";

import { CustomRequest } from "../../middlewares/token-decode";
import { genderModel } from "../../model/admin/genderModel";
import { log } from "console";
import { adminModel } from "../../model/admin/adminModel";

export const addGender = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const admin = await adminModel.findById(userId);
    if (admin?.isApproved !== true) {
      return res.status(200).json({
        status: false,
        message: "no allow",
        data: "",
      });
    }
    const { gender } = req.body;
    const existGender = await genderModel.find({
      gender: gender,
    });
    log("gender", gender.toLowerCase());
    const allowedGenders = ["male", "female", "other"];
    if (!allowedGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({
        status: false,
        message: "no other gender allowed",
        data: "",
      });
    }
    if (existGender.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Alredy exist ",
        data: "",
      });
    }
    const newGender = new genderModel({
      gender: gender,
      addedBy: userId,
    });
    await newGender.save();
    return res.status(200).json({
      status: true,
      message: "new Gender added",
      data: newGender,
    });
  } catch (error: any) {
    console.log("error", error.message);
    return res.status(400).json({
      status: false,
      message: "something Went wrong",
      data: "",
    });
  }
};
