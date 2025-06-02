import express, { Request, Response } from "express";
import generateNumericOTP from "../../helpers/otpGenerator";
import mongoose from "mongoose";
import verificationModel from "../../model/verificationModel";
import { UserModel } from "../../model/user/userModel";
import generateToken from "../../helpers/Usertoken";
import { CustomRequest } from "../../middlewares/token-decode";
import { genderModel } from "../../model/admin/genderModel";
import { intrestModel } from "../../model/admin/intrestModel";
import { log } from "console";

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
    await verificationModel.findByIdAndDelete(verify._id);
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
      await verificationModel.findByIdAndDelete(verify._id);
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
    const { name, dob, gender, intrestedthings, location, attract } = req.body;
    let query: any = {};
    const user = await UserModel.findById(userId);
    const photoPath = req.file?.path;
    if (photoPath) query.profilePicture = photoPath;
    if (name) query.name = name;
    if (dob) {
      query.birthDate = dob;
      // Calculate age from dob (assuming dob is in ISO string or Date format)
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).json({
          status: false,
          message: "Age must be greater than 18",
          data: "",
        });
      }
      query.age = age;
    }
    if (gender) query.gender = gender;
    if (intrestedthings) {
      if (Array.isArray(intrestedthings)) {
        query.intrestedthings = intrestedthings.map(
          (id: string) => new mongoose.Types.ObjectId(id.trim ? id.trim() : id)
        );
      } else if (typeof intrestedthings === "string") {
        query.intrestedthings = intrestedthings
          .split(",")
          .map((id: string) => new mongoose.Types.ObjectId(id.trim()));
      }
    }
    if (location) {
      query.location = {
        city: location.city || "",
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
      };
    }
    if (attract) {
      query.attract = attract;
    }

    // Check if all fields are present in the request or already exist in the database
    const finalName = name || user?.name;
    const finalDob = dob || user?.birthDate;
    const finalGender = gender || user?.gender;
    const finalintrestedthings = intrestedthings || user?.intrestedthings;
    const finalLocation = location || user?.location;
    const finalAttract = attract || user?.attract;

    if (
      finalName &&
      finalDob &&
      finalGender &&
      finalintrestedthings &&
      finalLocation &&
      finalLocation.city &&
      finalLocation.latitude !== undefined &&
      finalLocation.longitude !== undefined &&
      finalAttract
    ) {
      query.isProfileCompleted = true;
    }

    const updateData = await UserModel.findByIdAndUpdate(userId, query, {
      new: true,
    });
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

export const getGender = async (req: Request, res: Response) => {
  try {
    const genders = await genderModel.find();
    return res.status(200).json({
      status: true,
      message: "Gender retrive",
      data: genders,
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

export const getAllIntrest = async (req: Request, res: Response) => {
  try {
    const intrests = await intrestModel.find({
      status: "active",
    });
    return res.status(200).json({
      status: true,
      message: "Intrest list",
      data: intrests,
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
