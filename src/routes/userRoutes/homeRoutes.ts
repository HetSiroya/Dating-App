import express from "express";
import { auth } from "../../middlewares/token-decode";
import { getUsers } from "../../controllers/users/fetchuserController";
const router = express.Router();

router.get("/getUsers", auth, async (req, res, next) => {
  try {
    await getUsers(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
