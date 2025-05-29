import express from "express";
import { signUp } from "../../controllers/admin/adminAuthControllers";
const router = express.Router();

router.post("/signUp", async (req, res, next) => {
  try {
    await signUp(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
