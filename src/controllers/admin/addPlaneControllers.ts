import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { planeModel } from "../../model/admin/planModel";
import { log } from "console";

export const addPlane = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { planeName, price, details } = req.body;
    const newPlan = new planeModel({
      addedBy: userId,
      planeName: planeName,
      detail: details,
      price: price,
    });
    await newPlan.save();
    return res.status(200).json({
      status: true,
      message: "new palne added succesfully",
      data: newPlan,
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

export const getPlane = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { status } = req.body;
    let query: any = {};
    if (status) {
      log("status", status);
      if (status != "active" && status != "inactive") {
        return res.status(400).json({
          status: false,
          message: "invalid parameter",
          data: "",
        });
      }
      query.status = status;
    }
    const plans = await planeModel.find(query);
    return res.status(200).json({
      status: true,
      message: "Plane retrive successfully",
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

export const updatePlane = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { planId } = req.params;
    const plan = await planeModel.findById(planId);
    if (!plan) {
      return res.status(400).json({
        status: false,
        message: "Plan not found",
        data: "",
      });
    }
    const { price, details, planeName, status } = req.body;
    let query: any = {};
    if (price) query.price = price;
    if (details) query.details = details;
    if (planeName) query.planeName = planeName;
    if (status) {
      if (status) {
        log("status", status);
        if (status != "active" && status != "inactive") {
          return res.status(400).json({
            status: false,
            message: "invalid parameter",
            data: "",
          });
        }
        query.status = status;
      }
    }

    const updatePlane = await planeModel.findByIdAndUpdate(planId, query, {
      new: true,
    });
    return res.status(200).json({
      status: false,
      message: "update Succesfully",
      data: updatePlane,
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
