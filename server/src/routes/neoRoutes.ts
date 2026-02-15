import { Router, Request, Response } from "express";
import { getNeoFeed, getNeoLookup, getNeoBrowse } from "../services/neoService";
import { withCache, CACHE_TTL } from "../config/redis";

const router = Router();

// ─── Neo Feed ── GET /api/neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get("/feed", async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    // Default: today → +7 days
    const today = new Date();
    const startDate =
      (start_date as string) || today.toISOString().split("T")[0];
    const endDateDefault = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = (end_date as string) || endDateDefault;

    const cacheKey = `neo:feed:${startDate}:${endDate}`;

    const data = await withCache(cacheKey, CACHE_TTL.NEO_FEED, () =>
      getNeoFeed(startDate, endDate),
    );

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching NEO feed:", error?.message);
    res
      .status(500)
      .json({ message: "Error fetching NEO feed", error: error?.message });
  }
});

// ─── Neo Lookup ── GET /api/neo/lookup/:asteroidId
router.get("/lookup/:asteroidId", async (req: Request, res: Response) => {
  try {
    const asteroidId = req.params.asteroidId as string;
    const cacheKey = `neo:lookup:${asteroidId}`;

    const data = await withCache(cacheKey, CACHE_TTL.NEO_LOOKUP, () =>
      getNeoLookup(asteroidId),
    );

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching NEO lookup:", error?.message);
    res
      .status(500)
      .json({ message: "Error fetching NEO lookup", error: error?.message });
  }
});

// ─── Neo Browse ── GET /api/neo/browse?page=0&size=20
router.get("/browse", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const size = parseInt(req.query.size as string) || 20;
    const cacheKey = `neo:browse:${page}:${size}`;

    const data = await withCache(cacheKey, CACHE_TTL.NEO_BROWSE, () =>
      getNeoBrowse(page, size),
    );

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching NEO browse:", error?.message);
    res
      .status(500)
      .json({ message: "Error fetching NEO browse", error: error?.message });
  }
});

export default router;
