import express from "express";
import { auth } from "../../middlewares/token-decode";
import {
  addFavorite,
  getFavorite,
  removeFavorite,
} from "../../controllers/users/favoriteControllers";
const router = express.Router();

router.post("/addFavorite/:to", auth, async (req, res, next) => {
  try {
    await addFavorite(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getFavorite", auth, async (req, res, next) => {
  try {
    await getFavorite(req, res);
  } catch (error) {
    next(error);
  }
});
router.delete("/removeFavrite/:favoriteId", auth, async (req, res, next) => {
  try {
    await removeFavorite(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
