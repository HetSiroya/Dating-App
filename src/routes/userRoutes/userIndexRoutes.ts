import express from "express";
const router = express.Router();
import auth from "./authRoutes";

router.use("/auth", auth);

export default router;
