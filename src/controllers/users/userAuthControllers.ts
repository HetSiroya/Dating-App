import express, { Request, Response } from "express";
import generateNumericOTP from "../../helpers/otpGenerator";
import verificationModel from "../../model/verificationModel";
import { UserModel } from "../../model/user/userModel";
import generateToken from "../../helpers/token";
import { CustomRequest } from "../../middlewares/token-decode";

export const registerThrougMobileNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({
        status: false,
        message: "Mobile number is requires",
        data: "",
      });
    }
    const otp = generateNumericOTP();
    const newVerification = new verificationModel({
      mobileNumber: mobileNumber,
      otp: otp,
    });
    await newVerification.save();
    return res.status(200).json({
      status: true,
      message: " otp sent succesfully",
      data: newVerification,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "something Went wrong",
      data: "",
    });
  }
};

export const registerThrougEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "email is requires",
        data: "",
      });
    }
    const otp = generateNumericOTP();
    const newVerification = new verificationModel({
      email: email,
      otp: otp,
    });
    await newVerification.save();
    return res.status(200).json({
      status: true,
      message: " otp sent succesfully",
      data: newVerification,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "something Went wrong",
      data: "",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const verify = await verificationModel.findOne({
      email: email,
    });
    if (!verify) {
      return res.status(400).json({
        status: false,
        message: "Not Found",
        data: "",
      });
    }
    if (verify.otp !== otp) {
      return res.status(400).json({
        status: false,
        message: "otp not match",
        data: "",
      });
    }
    let data;
    data = await UserModel.findOne({
      email: email,
    });
    if (data) {
      const tokenData = {
        _id: data._id,
        email: data.email,
        isProfileCompleted: data.isProfileCompleted,
        mobileNumber: data.mobilenumber,
      };
      const token = generateToken(tokenData);
      return res.status(200).json({
        status: true,
        message: "login Succesfully",
        data: data,
        token: token,
      });
    }
    data = new UserModel({
      email: email,
    });
    await data.save();
    // Optionally, generate a token for the new user as well
    const tokenData = {
      _id: data._id,
      email: data.email,
      isProfileCompleted: data.isProfileCompleted,
      mobileNumber: data.mobilenumber,
    };
    const token = generateToken(tokenData);
    return res.status(200).json({
      status: true,
      message: "login Succesfully",
      data: data,
      token: token,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "something Went wrong",
      data: "",
    });
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, dob, gender, intrestedthings } = req.body;
    let query: any;
    query = {};
    const user = await UserModel.findById(userId);
    const photoPath = req.file?.path;
    if (photoPath) query.profilePicture = photoPath;
    if (name) query.name = name;
    if (dob) query.birthDate = dob;
    if (gender) query.gender = gender;
    if (intrestedthings) query.intrestedthings = intrestedthings;
    // Check if all fields are present in the request or already exist in the database
    const finalName = name || user?.name;
    const finalDob = dob || user?.birthDate;
    const finalGender = gender || user?.gender;
    const finalintrestedthings = intrestedthings || user?.intrestedthings;

    if (finalName && finalDob && finalGender && finalintrestedthings) {
      query.isProfileCompleted = true;
    }
    const updateData = await UserModel.findByIdAndUpdate(userId, query, {
      new: true,
    });
    // console.log("updateData", updateData);
    if (!updateData) {
      return res.status(400).json({
        status: false,
        message: "not updated data ",
        data: "",
      });
    }
    const tokenData = {
      _id: updateData._id,
      email: updateData.email,
      isProfileCompleted: updateData.isProfileCompleted,
      mobileNumber: updateData.mobilenumber,
    };
    const token = generateToken(tokenData);

    return res.status(200).json({
      status: true,
      message: "update sccesfully",
      data: updateData,
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
