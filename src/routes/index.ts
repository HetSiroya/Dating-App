import express from "express";
const router = express.Router();
import user from "./userRoutes/userIndexRoutes";
import admin from "./AdminRoutes/adminIndexRoutes";

router.use("/User", user);
router.use("/Admin", admin);

export default router;
