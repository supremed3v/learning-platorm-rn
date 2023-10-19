import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  becomeInstructor,
  resetPassword,
  forgotPassword,
  registerInstructor,
} from "../controllers/userController.js";
import singleFile from "../middlewares/singleFile.js";
import { authCheck } from "../middlewares/auth.js";
import {
  addToPlaylist,
  getSingleUserCourse,
  removeCourse,
  userCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Tested and working
router.route("/register").post(singleFile, registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

router.route("/me").get(authCheck, getUser);
router.route("/register-instructor").post(singleFile, registerInstructor);

// Yet to be tested
router.route("/me/update").put(authCheck, singleFile, updateUser);
router.route("/me/my-courses").get(authCheck, userCourse);
router.route('/me/my-courses/:id').get(authCheck, getSingleUserCourse);
router.route("/me/my-courses/:id").delete(authCheck, removeCourse);
router.route("/me/become-instructor").put(authCheck, becomeInstructor);
router.route("/forgot-password").post(authCheck, forgotPassword);
router.route("/reset-password/:token").put(resetPassword);
router.route("/me/add-to-playlist").post(authCheck, addToPlaylist);

export default router;
