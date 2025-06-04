import { log } from "console";
import { CustomRequest } from "../../middlewares/token-decode";
import { userModel } from "../../model/user/userModel";
import express, { Request, Response } from "express";
import { getDistance as geolibGetDistance } from "geolib";

export const getUsers = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (user?.isProfileCompleted !== true) {
      return res.status(400).json({
        status: false,
        message: "Please complete your profile",
        data: "",
      });
    }

    const { age, intrest, categroy } = req.body;
    const { page, limit } = req.query;
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 2;

    const location =
      typeof user?.location === "object" && user?.location !== null
        ? (user.location as {
            city?: string;
            latitude?: number;
            longitude?: number;
          })
        : {};

    const { latitude, longitude } = location;

    let query: any = { _id: { $ne: user._id }, isProfileCompleted: true };

    log("premium", user.isPremium);
    if (age) {
      if (user.isPremium !== true) {
        return res.status(400).json({
          status: false,
          message: "You need premium for this",
          data: "",
        });
      }
      query.age = age;
    }
    if (intrest) query.intrest = intrest;
    if (categroy) query.gender = categroy;

    let usersQuery = userModel.find(query);

    // If not premium, limit to 20 users
    let effectiveLimit = user.isPremium === true ? parsedLimit : 20;
    let effectivePage = parsedPage;

    usersQuery = usersQuery
      .skip((effectivePage - 1) * effectiveLimit)
      .limit(effectiveLimit);

    const users = await usersQuery;

    // Add distance to each user (if possible) using geolib
    const usersWithDistance = users.map((u) => {
      const userLoc =
        typeof u.location === "object" && u.location !== null
          ? (u.location as {
              latitude?: number;
              longitude?: number;
            })
          : {};
      const userLat = userLoc.latitude;
      const userLon = userLoc.longitude;

      let distance = Number.MAX_VALUE;
      if (
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        typeof userLat === "number" &&
        typeof userLon === "number"
      ) {
        distance =
          geolibGetDistance(
            { latitude, longitude },
            { latitude: userLat, longitude: userLon }
          ) / 1000; // convert meters to km
      }

      return { ...u.toObject(), distance };
    });

    // Sort by distance only
    const sortedUsers = usersWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    // Get total count for pagination
    const totalUsers = await userModel.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / effectiveLimit);

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: sortedUsers,
      pagination: {
        total: totalUsers,
        page: effectivePage,
        limit: effectiveLimit,
        totalPages,
      },
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
