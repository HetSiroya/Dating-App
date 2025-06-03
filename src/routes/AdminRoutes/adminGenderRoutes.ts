import express from "express";
import { auth } from "../../middlewares/token-decode";
import { addGender, updateGender } from "../../controllers/admin/adminGenderControllers";
import { getGender } from "../../controllers/users/userAuthControllers";
const router = express.Router();

router.post("/addGender", auth, async (req, res, next) => {
  try {
    await addGender(req , res);
  } catch (error) {
    next(error);
  }
});

router.get("/getGender", auth, async (req, res, next) => {
  try {
    await getGender(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/updateGender' , auth , async (req , res , next) =>{
  try {
    await updateGender(req , res)
  } catch (error) {
    next(error)
  }
})

export default router
