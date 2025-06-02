import { CustomRequest } from "../../middlewares/token-decode";
import { UserModel } from "../../model/user/userModel";
import express, { Request, Response } from "express";

export const getUsers = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (user?.isProfileCompleted !== true) {
      return res.status(400).json({
        status: false,
        message: "Please complete your profile",
        data: "",
      });
    }
    const { age, intrest, categroy } = req.body;
    // Get the user's city, latitude, and longitude from location
    const location =
      typeof user?.location === "object" && user?.location !== null
        ? (user.location as {
            city?: string;
            latitude?: number;
            longitude?: number;
          })
        : {};
    const { city, latitude, longitude } = location;
    let query: any = { _id: { $ne: user._id } };
    // Find all users except the current user
    // Prioritize users from the same city, then others
    if (age) {
      if (user.isPremium !== true) {
        return res.status(400).json({
          status: false,
          message: "You need perium for this",
          data: "",
        });
      }
      query.age = age;
    }
    if (intrest) query.intrest = intrest;
    if (categroy) query.gender = categroy;
    const users = await UserModel.find(query);

    // Separate users by city
    const sameCityUsers = users.filter(
      (u) =>
        typeof u.location === "object" &&
        u.location !== null &&
        (u.location as { city?: string }).city === city
    );
    const otherUsers = users.filter(
      (u) =>
        typeof u.location !== "object" ||
        u.location === null ||
        (u.location as { city?: string }).city !== city
    );
    // Combine, prioritizing same city users
    const data = [...sameCityUsers, ...otherUsers];

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: data,
    });
  } catch (error: any) {
    console.log("error", error.message);
    return res.status(400).json({
      status: false,
      message: "Something went wrong",
      data: "",
    });
  }
};


