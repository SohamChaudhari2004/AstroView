import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

console.log("App Module Initialized");

import nasaRoutes from "./routes/nasaRoutes";
import authRoutes from "./routes/authRoutes";
import missionRoutes from "./routes/missionRoutes";
import isroRoutes from "./routes/isroRoutes";
import marsRoutes from "./routes/marsRoutes";
import spaceWeatherRoutes from "./routes/spaceWeatherRoutes";
import osdrRoutes from "./routes/osdrRoutes";
import nasaMediaRoutes from "./routes/nasaMediaRoutes";
import apodRoutes from "./routes/apodRoutes";
import neoRoutes from "./routes/neoRoutes";
import chatRoutes from "./routes/chatRoutes";

import { getTechTransferData } from "./controllers/techTransferController";

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://astro-view-beta.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
console.log("Registering TechTransfer route at /api/tech-transfer");
app.get(
  "/api/tech-transfer",
  (req, res, next) => {
    console.log(`[Route Check] Hit /api/tech-transfer with query:`, req.query);
    next();
  },
  getTechTransferData,
);

app.get("/api/test-route", (req, res) =>
  res.json({ message: "Routing is working" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/nasa", nasaRoutes);
app.use("/api/missions", missionRoutes);
app.use("/api/isro", isroRoutes);
app.use("/api/mars", marsRoutes);
app.use("/api/space-weather", spaceWeatherRoutes);
app.use("/api/osdr", osdrRoutes);
app.use("/api/nasa-media", nasaMediaRoutes);
app.use("/api/apod", apodRoutes);
app.use("/api/neo", neoRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("AstroView API is running");
});

export default app;
