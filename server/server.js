import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/course.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(express.json({ limit: "100mb" }));

const PORT = process.env.PORT || 8000;
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", stripeRoutes);

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error.message);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection: ", error.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("ValidationError", (error) => {
  console.log("Validation Error: ", error.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});
