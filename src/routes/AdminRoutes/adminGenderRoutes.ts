import express from "express";
import { auth } from "../../middlewares/token-decode";
import { addGender } from "../../controllers/admin/adminGenderControllers";
const router = express.Router();

router.post("/addGender", auth, async (req, res, next) => {
  try {
    await addGender(req , res);
  } catch (error) {
    next(error);
  }
});


export default router
