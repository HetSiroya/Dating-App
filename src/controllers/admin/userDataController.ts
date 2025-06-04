import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { userModel } from "../../model/user/userModel";
import { matchModel } from "../../model/user/matchModel";

export const getAllStudent = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { age, intrest, gender, isPremium } = req.body;
    let query: any = {};
    if (age) query.age = age;
    if (intrest) query.intrestedthings = intrest;
    if (gender) query.gender = gender;
    if (typeof isPremium !== "undefined") query.isPremium = isPremium;
    const data = await userModel.find(query);
    return res.status(200).json({
      status: true,
      message: "User Fetch succesfully",
      data: data,
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

export const userMatches = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { id } = req.query;
    let query: any = {};
    if (id) {
      query = { $or: [{ user1: id }, { user2: id }] };
    }
    const data = await matchModel.find(query);
    return res.status(200).json({
      status: true,
      message: "user match data",
      data: data,
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
