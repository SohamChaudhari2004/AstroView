"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPODRange = exports.getRandomAPOD = exports.getAPOD = void 0;
const axios_1 = __importDefault(require("axios"));
const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const APOD_BASE_URL = "https://api.nasa.gov/planetary/apod";
/**
 * Get APOD for a specific date
 */
const getAPOD = async (date) => {
    const params = {
        api_key: NASA_API_KEY,
        thumbs: "true",
    };
    if (date)
        params.date = date;
    const response = await axios_1.default.get(APOD_BASE_URL, { params, timeout: 15000 });
    return response.data;
};
exports.getAPOD = getAPOD;
/**
 * Get a random APOD image
 */
const getRandomAPOD = async (count = 1) => {
    const params = {
        api_key: NASA_API_KEY,
        count,
        thumbs: "true",
    };
    const response = await axios_1.default.get(APOD_BASE_URL, { params, timeout: 15000 });
    return Array.isArray(response.data) ? response.data : [response.data];
};
exports.getRandomAPOD = getRandomAPOD;
/**
 * Get APOD for a date range
 */
const getAPODRange = async (startDate, endDate) => {
    const params = {
        api_key: NASA_API_KEY,
        start_date: startDate,
        thumbs: "true",
    };
    if (endDate)
        params.end_date = endDate;
    const response = await axios_1.default.get(APOD_BASE_URL, { params, timeout: 15000 });
    return Array.isArray(response.data) ? response.data : [response.data];
};
exports.getAPODRange = getAPODRange;
