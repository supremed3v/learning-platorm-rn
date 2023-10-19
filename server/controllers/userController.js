import { User } from "../models/user.js";
import cloudinary from "cloudinary";
import { sendJwt } from "../middlewares/sendJwt.js";
import parseData from "../utils/dataParser.js";
import sendEmail from "../utils/sendMail.js";
import crypto from "crypto";

// @desc    Register a user

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const file = req.file;
    const data = parseData(file);

    if (file) {
      const result = await cloudinary.v2.uploader.upload(data.content, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });
    } else {
      await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: "url",
          url: "url",
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  next();
};

// @desc    Login user

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }

    const checkUser = await User.findOne({ email }).select("+password");

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await checkUser.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    sendJwt(checkUser, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

export const updateUser = async (req, res) => {
  const { name, email, newPassword, oldPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (email) {
      user.email = email;
    } else if (name) {
      user.name = name;
    } else if (password) {
      if (user.matchPassword(oldPassword)) {
        user.password = newPassword;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }
    }

    const file = req.file;

    if (file) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const data = parseData(file);
      const result = await cloudinary.v2.uploader.upload(data.content, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await user.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const becomeInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+role");

    if (user.role !== "instructor") {
      user.role = "instructor";
      await user.save();
      res.status(200).json({
        success: true,
        message: "You are now an instructor",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "You are already an instructor",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:
  \n\n${resetUrl}
  \n\nIf you have not requested this email, then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Password recovery email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const registerInstructor = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  const checkEmail = User.findOne({ email });

  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image",
    });
  }

  const data = parseData(file);

  const result = await cloudinary.v2.uploader.upload(data.content, {
    folder: "avatars",
    crop: "scale",
  });

  await User.create({
    name,
    email,
    password,
    role: "instructor",
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Registration successful",
  });
};
