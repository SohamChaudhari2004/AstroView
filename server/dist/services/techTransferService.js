"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSpinoffs = exports.searchSoftware = exports.searchPatents = exports.fetchTechTransferData = void 0;
const axios_1 = __importDefault(require("axios"));
const NASA_API_KEY = process.env.NASA_API_KEY || "fxpgQ4j0RVUvt8lIaQvzaVgb6LNZ7GPgTIHAv4b6";
const TECH_TRANSFER_BASE_URL = "https://technology.nasa.gov/api/api";
/**
 * Fetches NASA Technology Transfer data (patents, software, spinoffs)
 * API Documentation: Per NASA HTML response, actual working endpoint is:
 * https://technology.nasa.gov/api/api/[patent|software|spinoff]/{keywords}
 * Example: https://technology.nasa.gov/api/api/patent/rocket
 * @param queryParams - Query parameters for filtering tech transfer data
 * @returns Promise<TechTransferResponse>
 */
const fetchTechTransferData = async (queryParams) => {
    try {
        const { patent, patent_issued, software, spinoff } = queryParams;
        // Build the API endpoint based on the query type
        // Format: https://technology.nasa.gov/api/api/[patent|software|spinoff]/{keyword}
        let endpoint = TECH_TRANSFER_BASE_URL;
        let keyword = "";
        // Determine which endpoint to use based on query parameters
        if (patent) {
            endpoint += "/patent";
            keyword = patent;
        }
        else if (patent_issued) {
            endpoint += "/patent";
            keyword = patent_issued;
        }
        else if (software) {
            endpoint += "/software";
            keyword = software;
        }
        else if (spinoff) {
            endpoint += "/spinoff";
            keyword = spinoff;
        }
        else {
            // Default to patent if no specific type is provided
            endpoint += "/patent";
            keyword = "";
        }
        // Append keyword to the URL path if provided
        if (keyword) {
            endpoint += `/${encodeURIComponent(keyword)}`;
        }
        console.log(`Fetching Tech Transfer data from: ${endpoint}`);
        const response = await axios_1.default.get(endpoint, {
            headers: {
                Accept: "application/json",
            },
        });
        console.log(`Tech Transfer API Response Status: ${response.status}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching tech transfer data:", error.message);
        if (error.response) {
            console.error("API Response Error:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
            });
            throw new Error(`NASA API Error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error("Failed to fetch tech transfer data");
    }
};
exports.fetchTechTransferData = fetchTechTransferData;
/**
 * Search for patents by keyword
 * @param keyword - Search term for patents
 * @returns Promise<TechTransferResponse>
 */
const searchPatents = async (keyword) => {
    return (0, exports.fetchTechTransferData)({ patent: keyword });
};
exports.searchPatents = searchPatents;
/**
 * Search for NASA software by keyword
 * @param keyword - Search term for software
 * @returns Promise<TechTransferResponse>
 */
const searchSoftware = async (keyword) => {
    return (0, exports.fetchTechTransferData)({ software: keyword });
};
exports.searchSoftware = searchSoftware;
/**
 * Search for NASA spinoff technologies by keyword
 * @param keyword - Search term for spinoffs
 * @returns Promise<TechTransferResponse>
 */
const searchSpinoffs = async (keyword) => {
    return (0, exports.fetchTechTransferData)({ spinoff: keyword });
};
exports.searchSpinoffs = searchSpinoffs;
