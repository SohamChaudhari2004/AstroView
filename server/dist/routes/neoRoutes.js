"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const neoService_1 = require("../services/neoService");
const redis_1 = require("../config/redis");
const router = (0, express_1.Router)();
// ─── Neo Feed ── GET /api/neo/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.get("/feed", async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        // Default: today → +7 days
        const today = new Date();
        const startDate = start_date || today.toISOString().split("T")[0];
        const endDateDefault = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        const endDate = end_date || endDateDefault;
        const cacheKey = `neo:feed:${startDate}:${endDate}`;
        const data = await (0, redis_1.withCache)(cacheKey, redis_1.CACHE_TTL.NEO_FEED, () => (0, neoService_1.getNeoFeed)(startDate, endDate));
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching NEO feed:", error?.message);
        res
            .status(500)
            .json({ message: "Error fetching NEO feed", error: error?.message });
    }
});
// ─── Neo Lookup ── GET /api/neo/lookup/:asteroidId
router.get("/lookup/:asteroidId", async (req, res) => {
    try {
        const asteroidId = req.params.asteroidId;
        const cacheKey = `neo:lookup:${asteroidId}`;
        const data = await (0, redis_1.withCache)(cacheKey, redis_1.CACHE_TTL.NEO_LOOKUP, () => (0, neoService_1.getNeoLookup)(asteroidId));
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching NEO lookup:", error?.message);
        res
            .status(500)
            .json({ message: "Error fetching NEO lookup", error: error?.message });
    }
});
// ─── Neo Browse ── GET /api/neo/browse?page=0&size=20
router.get("/browse", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const size = parseInt(req.query.size) || 20;
        const cacheKey = `neo:browse:${page}:${size}`;
        const data = await (0, redis_1.withCache)(cacheKey, redis_1.CACHE_TTL.NEO_BROWSE, () => (0, neoService_1.getNeoBrowse)(page, size));
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching NEO browse:", error?.message);
        res
            .status(500)
            .json({ message: "Error fetching NEO browse", error: error?.message });
    }
});
exports.default = router;
