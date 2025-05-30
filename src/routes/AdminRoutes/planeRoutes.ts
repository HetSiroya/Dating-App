import express from "express";
import { auth } from "../../middlewares/token-decode";
import {
  addPlane,
  getPlane,
  updatePlane,
} from "../../controllers/admin/addPlaneControllers";
const router = express.Router();

router.post("/addPlan", auth, async (req, res, next) => {
  try {
    await addPlane(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getPlan", auth, async (req, res, next) => {
  try {
    await getPlane(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch("/updatePlan/:planId", auth, async (req, res, next) => {
  try {
    await updatePlane(req, res);
  } catch (error) {
    next(error);
  }
});

export default router