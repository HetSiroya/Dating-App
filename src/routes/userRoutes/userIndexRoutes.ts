import express from "express";
const router = express.Router();
import auth from "./authRoutes";
import plan from "./planRoutes";
import home from './homeRoutes'

router.use("/auth", auth);
router.use("/plan", plan);
router.use('/home' , home )

export default router;
