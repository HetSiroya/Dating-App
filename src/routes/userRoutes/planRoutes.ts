import express from "express";
import {
  buyPlan,
  getPlan,
} from "../../controllers/users/planPurchaseControllers";
import { auth } from "../../middlewares/token-decode";
const router = express.Router();

router.get("/getPlan", async (req, res, next) => {
  try {
    await getPlan(req, res);
  } catch (error) {
    next(error);
  }
});
router.post("/buyPlan/:planId", auth, async (req, res, next) => {
  try {
    await buyPlan(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
