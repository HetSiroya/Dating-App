import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { UserModel } from "../../model/user/userModel";
import { likeModel } from "../../model/user/likeModel";

export const addLikeToUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { likeTo } = req.params;
    const likeUser = await UserModel.findById(likeTo);
    if (!likeUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        data: "",
      });
    }
    // Check if the user has already liked this user
    const alreadyLiked = await likeModel.findOne({ by: userId, to: likeTo });
    if (alreadyLiked) {
      return res.status(400).json({
      status: false,
      message: "You have already liked this user",
      data: "",
      });
    }
    const newLike = new likeModel({
      by: userId,
      to: likeTo,
    });
    await newLike.save();
    return res.status(200).json({
      status: true,
      message: "Succesfully liked",
      data: newLike,
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

export const fetchLikedUsers = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const likeUser = await likeModel.find({
      by: userId,
    });
    return res.status(200).json({
      status: true,
      message: "Liked User",
      data: likeUser,
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

export const removeUserLike = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { to } = req.params;
    const likeData = await likeModel.findOne({
      by: userId,
      to: to,
    });
    if (!likeData) {
      return res.status(400).json({
        status: false,
        message: "not found",
        data: "",
      });
    }
    await likeModel.findByIdAndDelete(likeData._id);
    return res.status(200).json({
      status: true,
      message: "Succesfully Dislike",
      data: likeData,
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
