import express from "express";
const router = express.Router();
import auth from "./adminAuthRoutes";
import gender from "./adminGenderRoutes";
import plan from "./planeRoutes";
import intrest from "./intrestRoutes";
import student from './stdentRoutes'

router.use("/auth", auth);
router.use("/gender", gender);
router.use("/plan", plan);
router.use("/intrest", intrest);
router.use('/student' , student )

export default router;
