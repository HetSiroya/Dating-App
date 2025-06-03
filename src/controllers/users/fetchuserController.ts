import { CustomRequest } from "../../middlewares/token-decode";
import { UserModel } from "../../model/user/userModel";
import express, { Request, Response } from "express";

// Helper: Haversine distance formula
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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

    let usersQuery = UserModel.find(query);

    // If not premium, limit to 20 users
    if (user.isPremium !== true) {
      usersQuery = usersQuery.limit(20);
    }

    const users = await usersQuery;

    // Add distance to each user (if possible)
    const usersWithDistance = users.map((u) => {
      const userLoc =
        typeof u.location === "object" && u.location !== null
          ? (u.location as {
              city?: string;
              latitude?: number;
              longitude?: number;
            })
          : {};
      const userLat = userLoc.latitude;
      const userLon = userLoc.longitude;

      let distance = Number.MAX_VALUE;
      if (latitude && longitude && userLat && userLon) {
        distance = getDistance(latitude, longitude, userLat, userLon);
      }

      return { ...u.toObject(), distance };
    });

    // Separate and sort
    const sameCityUsers = usersWithDistance
      .filter((u) => u.location.city === city)
      .sort((a, b) => a.distance - b.distance);

    const otherUsers = usersWithDistance
      .filter((u) => u.location?.city !== city)
      .sort((a, b) => a.distance - b.distance);

    const sortedUsers = [...sameCityUsers, ...otherUsers];

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: sortedUsers,
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
