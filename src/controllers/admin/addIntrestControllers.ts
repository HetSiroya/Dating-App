import express, { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/token-decode";
import { intrestModel } from "../../model/admin/intrestModel";
import { log } from "console";

export const addIntrest = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { field } = req.body;
    const exist = await intrestModel.findOne({
      intrestName: field.toLowerCase(),
    });
    if (exist) {
      return res.status(400).json({
        status: false,
        message: "Already Exist this field",
        data: "",
      });
    }
    const newIntrest = new intrestModel({
      addedBy: userId,
      intrestName: field.toLowerCase(),
    });
    await newIntrest.save();
    return res.status(200).json({
      status: true,
      message: "Added Succesfully",
      data: newIntrest,
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

export const getAllIntrest = async (req: CustomRequest, res: Response) => {
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
    const intrests = await intrestModel.find(query);
    return res.status(200).json({
      status: true,
      message: "Added Succesfully",
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

export const updateIntrest = async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;
  const { intrestId } = req.params;
  const exist = await intrestModel.findById(intrestId);
  if (!exist) {
    return res.status(400).json({
      status: false,
      message: "not Exist ",
      data: "",
    });
  }
  const { intrestName, status } = req.body;
  let query: any = {};
  if (intrestName) {
    const intrestExist = await intrestModel.findOne({
      intrestName: intrestName.toLowerCase(),
    });
    if (intrestExist) {
      return res.status(400).json({
        status: false,
        message: "Already Exist this field",
        data: "",
      });
    }
    query.intrestName = intrestName.toLowerCase();
  }
  if (status) {
    log("status", status);
    if (status != "active" && status != "inactive") {
      return res.status(400).json({
        status: false,
        message: "invalid parameter",
        data: "",
      });
    }
    query.status = status.toLowerCase();
  }
  log(exist);
  const updateIntrest = await intrestModel.findByIdAndUpdate(exist._id, query, {
    new: true,
  });
  return res.status(200).json({
    status: true,
    message: "Update Succesfully",
    data: updateIntrest,
  });
};
