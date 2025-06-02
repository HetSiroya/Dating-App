import express from "express";
import { auth } from "../../middlewares/token-decode";
import {
  addLikeToUser,
  fetchLikedUsers,
  removeUserLike,
} from "../../controllers/users/likeController";
const router = express.Router();

router.post("/likeUser/:likeTo", auth, async (req, res, next) => {
  try {
    await addLikeToUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getLike", auth, async (req, res, next) => {
  try {
    await fetchLikedUsers(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/disLike/:to", auth, async (req, res, next) => {
  try {
    await removeUserLike(req, res);
  } catch (error) {
    next(error);
  }
});

export default router