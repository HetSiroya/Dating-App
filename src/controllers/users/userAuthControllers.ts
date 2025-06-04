import express, { Request, Response } from "express";
import generateNumericOTP from "../../helpers/otpGenerator";
import mongoose from "mongoose";
import verificationModel from "../../model/verificationModel";
import { userModel } from "../../model/user/userModel";
import generateToken from "../../helpers/Usertoken";
import { CustomRequest } from "../../middlewares/token-decode";
import { genderModel } from "../../model/admin/genderModel";
import { intrestModel } from "../../model/admin/intrestModel";

export const registerThrougMobileNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({
        status: false,
        message: "Mobile number is required",
        data: "",
      });
    }
    const otp = generateNumericOTP();
    let verification = await verificationModel.findOne({ mobileNumber });
    if (verification) {
      verification.otp = Number(otp);
      await verification.save();
    } else {
      verification = new verificationModel({
        mobileNumber: mobileNumber,
        otp: otp,
      });
      await verification.save();
    }
    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      data: verification,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "Something went wrong",
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
        message: "Email is required",
        data: "",
      });
    }
    const otp = generateNumericOTP();
    let verification = await verificationModel.findOne({ email });
    if (verification) {
      verification.otp = Number(otp);
      await verification.save();
    } else {
      verification = new verificationModel({
        email: email,
        otp: otp,
      });
      await verification.save();
    }
    return res.status(200).json({
      status: true,
      message: "OTP sent successfully",
      data: verification,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "Something went wrong",
      data: "",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, mobileNumber, otp } = req.body;

    // Build dynamic query for verification

    const query: any = {};
    if (email) query.email = email;
    if (mobileNumber) query.mobileNumber = mobileNumber;

    if (!otp || (!email && !mobileNumber)) {
      return res.status(400).json({
        status: false,
        message: "Email or mobile number and OTP are required",
        data: "",
      });
    }
    const verify = await verificationModel.findOne(query);
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
        message: "OTP does not match",
        data: "",
      });
    }
    await verificationModel.findByIdAndDelete(verify._id);

    // Build dynamic query for user
    const userQuery: any = {};
    if (email) userQuery.email = email;
    if (mobileNumber) userQuery.mobileNumber = mobileNumber;

    let data = await userModel.findOne(userQuery);
    if (data) {
      const tokenData = {
        _id: data._id,
        email: data.email,
        isProfileCompleted: data.isProfileCompleted,
        mobileNumber: data.mobileNumber,
      };
      const token = generateToken(tokenData);
      return res.status(200).json({
        status: true,
        message: "Login successfully",
        data: data,
        token: token,
      });
    }

    // Create new user dynamically
    const newUser: any = {};
    if (email) newUser.email = email;
    if (mobileNumber) newUser.mobileNumber = mobileNumber;
    // log("useer", newUser);
    data = new userModel(newUser);
    await data.save();

    const tokenData = {
      _id: data._id,
      email: data.email,
      isProfileCompleted: data.isProfileCompleted,
      mobileNumber: data.mobileNumber,
    };
    const token = generateToken(tokenData);

    return res.status(200).json({
      status: true,
      message: "Login successfully",
      data: data,
      token: token,
    });
  } catch (error: any) {
    console.log("Error", error.message);
    return res.status(400).json({
      status: 400,
      message: "Something went wrong",
      data: "",
    });
  }
};

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { name, dob, gender, intrestedthings, location, attract } = req.body;
    let query: any = {};
    const user = await userModel.findById(userId);

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

    const updateData = await userModel.findByIdAndUpdate(userId, query, {
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
      mobileNumber: updateData.mobileNumber,
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

export const getYourProfile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const userData = await userModel.findById(userId);
    return res.status(200).json({
      status: true,
      message: "Your data",
      data: userData,
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

export const updateProfilePhoto = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const photoPath = req.file?.path;
    const update = await userModel.findByIdAndUpdate(userId, {
      profilePicture: photoPath,
    } , {new : true});
    return res.status(200).json({
      status: true,
      message: "Update profile photo succesfully",
      data: update,
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
