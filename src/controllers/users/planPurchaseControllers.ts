import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { planeModel } from "../../model/admin/planModel";
import purchaseModel from "../../model/user/planModel";
import { UserModel } from "../../model/user/userModel";

export const getPlan = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user;
    const plans = await planeModel.find({
      status: "active",
    });
    return res.status(200).json({
      status: true,
      message: "plan retrive",
      data: plans,
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

export const buyPlan = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { planId } = req.params;
    const plan = await planeModel.findById(planId);
    if (!plan) {
      return res.status(400).json({
        status: false,
        message: "Plan not Exist",
        data: "",
      });
    }
    const newPurchase = await new purchaseModel({
      userId: userId,
      planId: planId,
    });
    await UserModel.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
      },
      {
        new: true,
      }
    );
    await newPurchase.save();
    return res.status(200).json({
      status: true,
      message: "Succesfully Purchase Plan",
      data: newPurchase,
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
