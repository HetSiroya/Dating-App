import express from "express";
const router = express.Router();
import auth from "./authRoutes";
import plan from "./planRoutes";
import home from "./homeRoutes";
import like from "./likeRoutes";
import favorite from "./favouriteRoutes";

router.use("/auth", auth);
router.use("/plan", plan);
router.use("/home", home);
router.use("/like", like);
router.use("/favourite", favorite);

export default router;
