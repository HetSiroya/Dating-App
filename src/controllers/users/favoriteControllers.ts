import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import favoriteModel from "../../model/user/favoriteModel";
import { UserModel } from "../../model/user/userModel";

export const addFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { to } = req.params;
    // Check if the 'to' user exists
    if (userId == to) {
      return res.status(400).json({
        status: false,
        message: "you can't add youself in favorite",
        data: "",
      });
    }
    const toUser = await UserModel.findById(to);
    if (!toUser) {
      return res.status(404).json({
        status: false,
        message: "User to be favorited does not exist",
        data: "",
      });
    }
    // Check if already favorited
    const existingFavorite = await favoriteModel.findOne({
      by: userId,
      to: to,
    });
    if (existingFavorite) {
      return res.status(400).json({
        status: false,
        message: "User is already in favorites",
        data: "",
      });
    }
    const newFavorite = new favoriteModel({
      by: userId,
      to: to,
    });
    await newFavorite.save();
    return res.status(200).json({
      status: true,
      message: "added succesfully",
      data: newFavorite,
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

export const getFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const favoriteList = await favoriteModel.find({
      by: userId,
    });
    return res.status(200).json({
      status: true,
      message: "Your favrite List",
      data: favoriteList,
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

export const removeFavorite = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { favoriteId } = req.params;
    const exist = await favoriteModel.findById(favoriteId);
    if (!exist) {
      return res.status(400).json({
        status: false,
        message: "Not found favrite data",
        data: "",
      });
    }
    await favoriteModel.findByIdAndDelete(favoriteId);
    return res.status(200).json({
      status: true,
      message: "Remove from the list",
      data: exist,
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

export const fetchUsersWhoFavorited = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;
    console.log("userId" , userId);
    
    const data = await favoriteModel.find({
      to: userId,
    });
    return res.status(200).json({
      status: true,
      message: "User Who favorite You",
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
