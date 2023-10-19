import { Course } from "../models/course.js";
import { User } from "../models/user.js";
import cloudinary from "cloudinary";
import parseData from "../utils/dataParser.js";

export const createCourse = async (req, res) => {
  const { title, description, category, amount } = req.body;

  

  const instructor = await User.findById(req.user._id);

  if (!instructor) {
    return res.status(400).json({
      error: "Instructor not found",
    });
  }

  try {
    if (!title || !description || !category || !amount) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    const file = req.file;
    const data = parseData(file);

    if (!data) {
      return res.status(400).json({
        error: "Please upload a valid image",
      });
    }

    const result = await cloudinary.v2.uploader.upload(data.content, {
      folder: "courses",
      width: 150,
      crop: "scale",
    });

    const course = await Course.create({
      title,
      description,
      category,
      instructor: instructor._id,
      poster: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      amount,
    });


    instructor.paid_courses.push({
      course: course._id,
      price: course.amount,
    })

    await instructor.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

export const addLecture = async (req, res) => {
  const { title, description } = req.body;

  const course = await Course.findById(req.params.id);

  const file = req.file;

  const data = parseData(file);


  if (!data) {
    return res.status(400).json({
      error: "Please upload a valid video",
    });
  }

  try {
    if (!title || !description) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const result = await cloudinary.v2.uploader.upload_large(data.content, {
      resource_type: "video",
      folder: "courses",
      allowed_formats: ["mp4", "mov", "avi", "wmv", "webm", "flv", "mkv"],
      chunk_size: 6000000, 
    });

    course.lectures.push({
      title,
      description,
      video: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name") // populate instructor field with name field from User model
      .select("-lectures");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(400).json({
        error: "Course not found",
      });
    }

    const lecture = course.lectures.id(req.params.lectureId);

    if (!lecture) {
      return res.status(400).json({
        error: "Lecture not found",
      });
    }

    const result = await cloudinary.v2.uploader.destroy(
      lecture.video.public_id
    );

    if (result) {
      course.lectures.pull(lecture._id);

      course.numOfVideos = course.lectures.length;

      await course.save();

      res.status(200).json({
        success: true,
        message: "Lecture deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    

    if (!course) {
      return res.status(400).json({
        error: "Course not found",
      });
    }

    const lecture = course.lectures.id(req.params.lectureId);

    if (!lecture) {
      return res.status(400).json({
        error: "Lecture not found",
      });
    }

    const { title, description } = req.body;

    if(!title || !description) {
      lecture.title = title;
      lecture.description = description;

      await course.save();
    }

    if (req.file) {
      const file = req.file;

      const data = parseData(file);

      if (!data) {
        return res.status(400).json({
          error: "Please upload a valid video",
        });
      }

      const result = await cloudinary.v2.uploader.upload_large(
        data.content,
        {
          resource_type: "video",
          folder: "courses",
          allowed_formats: ["mp4", "mov", "avi", "wmv", "webm", "flv", "mkv", "webm"],
          chunk_size: 6000000,
        }
      );

      const result2 = await cloudinary.v2.uploader.destroy(
        lecture.video.public_id
      );

      if (result2) {
        lecture.video.public_id = result.public_id;
        lecture.video.url = result.secure_url;
      }
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const buyCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.playList.includes(course._id)) {
      return res.status(400).json({
        error: "Course already purchased",
      });
    }

    user.playList.push({
      course: course._id,
      poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Course purchased successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const removeCourse = async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.params.id);

  if (!user.playList.includes(course._id)) {
    return res.status(400).json({
      error: "Course not found",
    });
  }

  user.playList.pull(course._id);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Course removed successfully",
  });
};

export const userCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const courseId = user.playList.map((item) => item.course);

    const courses = await Course.find({ _id: { $in: courseId } })

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getSingleUserCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { id } = req.params;
    const course = await Course.findById(id);

    // Check if course exists in user's playList
    const courseIndex = user.playList.findIndex(item => item.course.toString() === course._id.toString());
    if (courseIndex === -1) {
      return res.status(400).json({
        error: "Course not found in user's playList",
        success: false
      });
    }

    // Get progress and completed status for course
    const progress = user.playList[courseIndex].progress;
    const completed = user.playList[courseIndex].completed;

    // Return course data with progress and completed status
    res.status(200).json({
      success: true,
      course,
      progress,
      completed
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}


export const addToPlaylist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { courseId } = req.body;

  if (user.playList.includes(courseId)) {
    return res.status(400).json({
      error: "Course already purchased",
    });
  } else {
    user.playList.push({
      course: courseId,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Course purchased successfully",
    });
  }
};

export const getSingleCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id)
      .populate("instructor", "name email")
      .select("-lectures"); // slice the first lecture only to show in the course card on the home page

    if (!course) {
      return res.status(400).json({
        error: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

export const getInstructorCourses = async (req, res) => {
  const instructor = await User.findById(req.user._id);

  try {
    const courses = await Course.find({ instructor: instructor._id })

    res.status(200).json({
      success: true,
      courses,
    });

    if(!courses){
      return res.status(400).json({
        error: "No courses found",
      });
    }

  } catch(error){
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }

}

export const getInstructorCourse = async (req, res) => {
  
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email")

    res.status(200).json({
      success: true,
      course,
    });

    if(!course){
      return res.status(400).json({
        error: "Course not found",
      });
    }

  } catch(error){
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
}