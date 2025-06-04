import express from "express";
import {
  getAllIntrest,
  getGender,
  getYourProfile,
  registerThrougEmail,
  registerThrougMobileNumber,
  updateProfile,
  verifyOtp,
} from "../../controllers/users/userAuthControllers";
import { auth } from "../../middlewares/token-decode";
import { uploadTo } from "../../middlewares/multer";
const router = express.Router();

router.post("/signUp-mobileNumber", async (req, res, next) => {
  try {
    await registerThrougMobileNumber(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/signUp-email", async (req, res, next) => {
  try {
    await registerThrougEmail(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/verify-otp", async (req, res, next) => {
  try {
    await verifyOtp(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/update-profile",
  auth,
  uploadTo("ProfilePicture").single("photo"),
  async (req, res, next) => {
    try {
      await updateProfile(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/getGender", async (req, res, next) => {
  try {
    await getGender(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getAllIntrest", async (req, res, next) => {
  try {
    await getAllIntrest(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/getYourProfileData", auth, async (req, res, next) => {
  try {
    await getYourProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
