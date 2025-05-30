import express, { Request, Response } from "express";
import { checkRequiredFields } from "../../helpers/commonValidator";
import { adminModel } from "../../model/admin/adminModel";
import { comparePassword, hashPassword } from "../../helpers/hased";
import generateTokenAdmin from "../../helpers/adminToken";
import generateToken from "../../helpers/Usertoken";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, mobileNumber, password, confirmPassword } = req.body;
    const exist = await adminModel.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });
    console.log("exist", exist);

    if (exist) {
      return res.status(400).json({
        status: false,
        message: "Admin exist ",
        data: "",
      });
    }
    const requiredFields = [
      "name",
      "email",
      "mobileNumber",
      "password",
      "confirmPassword",
    ];
    const validationError = checkRequiredFields(req.body, requiredFields);
    if (validationError) {
      return res.status(400).json({
        status: 400,
        message: validationError,
        data: "",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "password not match",
        data: "",
      });
    }
    const hasedPassword = await hashPassword(String(password));
    const newAdmin = new adminModel({
      name: name,
      email: email,
      mobileNumber: mobileNumber,
      password: hasedPassword,
    });
    await newAdmin.save();
    const payload = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      isApproved: newAdmin.isApproved,
    };
    const token = generateTokenAdmin(payload);
    return res.status(200).json({
      status: true,
      message: "Signup Succesfully",
      data: newAdmin,
      token: token,
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await adminModel.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "user not found",
        data: "",
      });
    }
    const passwordCheck = await comparePassword(
      String(password),
      String(user?.password)
    );
    if (!passwordCheck) {
      return res.status(400).json({
        status: false,
        message: "password  not match",
        data: "",
      });
    }
    const payLoad = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isApproved: user.isApproved,
    };
    const token = generateTokenAdmin(payLoad);
    return res.status(200).json({
      status: true,
      message: "login succesfully",
      data: user,
      token: token,
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
