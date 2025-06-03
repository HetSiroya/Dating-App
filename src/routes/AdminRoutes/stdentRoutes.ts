import express from "express";
import { getAllStudent, userMatches } from "../../controllers/admin/userDataController";
import { auth } from "../../middlewares/token-decode";
const router = express.Router();

router.get("/allUser", auth, async (req, res, next) => {
  try {
    await getAllStudent(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/userMatches" , auth , async(req , res , next) =>{
    try {
        await userMatches(req , res)
    } catch (error) {
        next(error)
    }
});

export default router