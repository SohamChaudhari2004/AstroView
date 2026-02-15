"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apodService = __importStar(require("../services/apodService"));
const redis_1 = require("../config/redis");
const router = express_1.default.Router();
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
        const ttl = date ? redis_1.CACHE_TTL.APOD_BY_DATE : redis_1.CACHE_TTL.APOD_TODAY;
        const data = await (0, redis_1.withCache)(cacheKey, ttl, () => apodService.getAPOD(date));
        res.json({ success: true, data });
    }
    catch (error) {
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
        const count = parseInt(req.query.count) || 1;
        const data = await apodService.getRandomAPOD(Math.min(count, 10));
        res.json({ success: true, data });
    }
    catch (error) {
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
        const data = await (0, redis_1.withCache)(cacheKey, redis_1.CACHE_TTL.APOD_BY_DATE, () => apodService.getAPODRange(start_date, end_date));
        res.json({ success: true, data });
    }
    catch (error) {
        console.error("APOD range error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch APOD range",
        });
    }
});
exports.default = router;
