import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const authCheck = async (req, res, next) => {
  const { token } = req.cookies;
  const { authorization } = req.headers;

  if (!token && !authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify( token || authorization.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const adminCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized. ${req.user.role} is not allowed to access this route`,
      });
    }
    next();
  };
};
