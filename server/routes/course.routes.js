import express from "express";
import singleFile from "../middlewares/singleFile.js";
import { authCheck, adminCheck } from "../middlewares/auth.js";
import {
  addLecture,
  buyCourse,
  createCourse,
  deleteLecture,
  getAllCourses,
  getCourses,
  getInstructorCourses,
  getSingleCourse,
  updateLecture,
  getInstructorCourse
} from "../controllers/courseController.js";

const router = express.Router();

// Tested and working

router
  .route("/course")
  .post(authCheck, singleFile, createCourse)
  .get(getCourses);

router.route("/courses").get(authCheck, adminCheck("admin"), getAllCourses);

router.route("/single-course/:id").get(getSingleCourse);

router
  .route("/course/add-lecture/:id")
  .post(authCheck, adminCheck("admin", "instructor"), singleFile, addLecture);
router
  .route("/course/lecture/:id/:lectureId")
  .delete(
    authCheck,
    adminCheck("admin", "instructor"),
    singleFile,
    deleteLecture
  )
  .put(authCheck, adminCheck("admin", "instructor"), singleFile, updateLecture);

router.route("/instructor/course/:id").get(authCheck, adminCheck("instructor"), getInstructorCourse);

// Yet to be tested

router.route("/course/buy/:id").post(authCheck, adminCheck("user","admin"), buyCourse);
router.route('/instructor/courses').get(authCheck, adminCheck("instructor"), getInstructorCourses)

export default router;
