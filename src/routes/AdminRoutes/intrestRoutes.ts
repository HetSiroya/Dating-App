import express from "express";
import { auth } from "../../middlewares/token-decode";
import {
  addIntrest,
  getAllIntrest,
  updateIntrest,
} from "../../controllers/admin/addIntrestControllers";
const router = express.Router();

router.post("/addIntrest", auth, async (req, res, next) => {
  try {
    await addIntrest(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getIntrest", auth, async (req, res, next) => {
  try {
    await getAllIntrest(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch("/updateIntrest/:intrestId", auth, async (req, res, next) => {
  try {
    await updateIntrest(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
