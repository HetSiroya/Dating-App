import express, { Request, Response } from "express";
import { checkRequiredFields } from "../../helpers/commonValidator";
import { adminModel } from "../../model/admin/adminModel";
import { hashPassword } from "../../helpers/hased";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, mobileNumber, password, confirmPassword } = req.body;
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
    if ( password !== confirmPassword){
        return res.status(400).json({
          status: 400,
          message: "password not match",
          data: "",
        });
    }
    const hasedPassword = await hashPassword(String(password))
    const newAdmin = new adminModel({
      name: name,
      email: email,
      mobileNumber: mobileNumber,
      password: hasedPassword,
    });
    await newAdmin.save();
    return res.status(200).json({
      status: true,
      message: "Signup Succesfully",
      data: newAdmin,
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
