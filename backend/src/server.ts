import authRoutes from "./routes/authRoutes";
import patientRoutes from "./routes/patientRoutes";

import connectDB from "./config/db";

import documentRoutes from "./routes/documentRoutes";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import timelineRoutes from "./routes/timelineRoutes";
import extractionRoutes from "./routes/extractionRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use("/api/timeline", timelineRoutes);
app.use("/api/extractions", extractionRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.get("/", (_req, res) => {
  res.json({
    message: "MedChron AI backend is running successfully!"
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "MedChron AI API is working"
  });
});

// HANDLE UNKNOWN API ROUTES
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found."
  });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// Replace the existing app.listen(...) with:
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`MedChron AI backend running on port ${PORT}`);
  });
};

void startServer();