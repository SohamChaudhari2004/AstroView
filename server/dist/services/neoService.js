"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNeoBrowse = exports.getNeoLookup = exports.getNeoFeed = void 0;
const axios_1 = __importDefault(require("axios"));
const NASA_API_KEY = process.env.NASA_API_KEY || "fxpgQ4j0RVUvt8lIaQvzaVgb6LNZ7GPgTIHAv4b6";
const NEO_BASE_URL = "https://api.nasa.gov/neo/rest/v1";
// ─── Service Functions ──────────────────────────────────────────────────────
/**
 * Neo Feed — Get NEOs by date range (max 7 days)
 */
const getNeoFeed = async (startDate, endDate) => {
    const response = await axios_1.default.get(`${NEO_BASE_URL}/feed`, {
        params: {
            start_date: startDate,
            end_date: endDate,
            api_key: NASA_API_KEY,
        },
    });
    return response.data;
};
exports.getNeoFeed = getNeoFeed;
/**
 * Neo Lookup — Get detailed info for a specific asteroid by its NASA SPK-ID
 */
const getNeoLookup = async (asteroidId) => {
    const response = await axios_1.default.get(`${NEO_BASE_URL}/neo/${asteroidId}`, {
        params: {
            api_key: NASA_API_KEY,
        },
    });
    return response.data;
};
exports.getNeoLookup = getNeoLookup;
/**
 * Neo Browse — Browse the overall asteroid dataset with pagination
 */
const getNeoBrowse = async (page = 0, size = 20) => {
    const response = await axios_1.default.get(`${NEO_BASE_URL}/neo/browse`, {
        params: {
            page,
            size,
            api_key: NASA_API_KEY,
        },
    });
    return response.data;
};
exports.getNeoBrowse = getNeoBrowse;
