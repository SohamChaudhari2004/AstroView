import express from "express";
import * as apodService from "../services/apodService";
import { withCache, CACHE_TTL } from "../config/redis";

const router = express.Router();

/**
 * GET /api/apod
 * Get today's APOD or by date
 */
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const cacheKey = date
      ? `apod:date:${date}`
      : `apod:today:${new Date().toISOString().slice(0, 10)}`;
    const ttl = date ? CACHE_TTL.APOD_BY_DATE : CACHE_TTL.APOD_TODAY;
    const data = await withCache(cacheKey, ttl, () =>
      apodService.getAPOD(date as string | undefined),
    );
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("APOD error:", error.message);
    res
      .status(500)
      .json({ success: false, error: error.message || "Failed to fetch APOD" });
  }
});

/**
 * GET /api/apod/random?count=1
 * Get random APOD(s) — NOT cached (random each time)
 */
router.get("/random", async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 1;
    const data = await apodService.getRandomAPOD(Math.min(count, 10));
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("APOD random error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch random APOD",
    });
  }
});

/**
 * GET /api/apod/range?start_date=...&end_date=...
 * Get APOD for a date range
 */
router.get("/range", async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    if (!start_date) {
      return res
        .status(400)
        .json({ success: false, error: "start_date is required" });
    }
    const cacheKey = `apod:range:${start_date}:${end_date || "now"}`;
    const data = await withCache(cacheKey, CACHE_TTL.APOD_BY_DATE, () =>
      apodService.getAPODRange(
        start_date as string,
        end_date as string | undefined,
      ),
    );
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("APOD range error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch APOD range",
    });
  }
});

export default router;
