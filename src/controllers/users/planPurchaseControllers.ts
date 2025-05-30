import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { planeModel } from "../../model/admin/planModel";

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

// export com
