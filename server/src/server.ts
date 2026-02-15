import app from "./app";
import { connectDB } from "./config/database";
import { connectRedis } from "./config/redis";
import "./jobs/cronJobs";

const PORT = process.env.PORT || 5001;
const HOST = "0.0.0.0"; // Required for Render deployment

const startServer = async () => {
  // Connect to MongoDB (optional - allows partial functionality without DB)
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(
      "⚠️ MongoDB connection failed. Some features may be unavailable:",
      error,
    );
  }

  // Connect to Redis (optional - allows functionality without caching)
  try {
    await connectRedis();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error(
      "⚠️ Redis connection failed. Caching will be unavailable:",
      error,
    );
  }

  // Start server regardless of DB connections (NASA APIs will still work)
  app.listen(HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();
