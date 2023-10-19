import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";
import connectDB from "./utils/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import courseRoutes from "./routes/course.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";

dotenv.config();

const app = express();

connectDB();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const PORT = process.env.PORT || 8000;
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", stripeRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
