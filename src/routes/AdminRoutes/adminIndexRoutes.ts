import express from "express";
const router = express.Router();
import auth from "./adminAuthRoutes";

router.use("/auth", auth);

export default router;
