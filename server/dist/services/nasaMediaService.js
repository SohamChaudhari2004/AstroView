"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaptions = exports.getMetadata = exports.getAsset = exports.searchMedia = void 0;
const axios_1 = __importDefault(require("axios"));
const NASA_IMAGES_BASE_URL = "https://images-api.nasa.gov";
/**
 * Search the NASA Image and Video Library
 * GET /search?q={q}
 */
const searchMedia = async (params) => {
    try {
        const queryParams = {};
        if (params.q)
            queryParams.q = params.q;
        if (params.center)
            queryParams.center = params.center;
        if (params.description)
            queryParams.description = params.description;
        if (params.keywords)
            queryParams.keywords = params.keywords;
        if (params.media_type)
            queryParams.media_type = params.media_type;
        if (params.nasa_id)
            queryParams.nasa_id = params.nasa_id;
        if (params.page)
            queryParams.page = params.page.toString();
        if (params.title)
            queryParams.title = params.title;
        if (params.year_start)
            queryParams.year_start = params.year_start;
        if (params.year_end)
            queryParams.year_end = params.year_end;
        console.log(`Searching NASA Media Library:`, queryParams);
        const response = await axios_1.default.get(`${NASA_IMAGES_BASE_URL}/search`, {
            params: queryParams,
            timeout: 30000,
        });
        console.log(`NASA Media Search Response Status: ${response.status}`);
        return response.data;
    }
    catch (error) {
        console.error("Error searching NASA media:", error.message);
        if (error.response) {
            throw new Error(`NASA Images API Error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error("Failed to search NASA media library");
    }
};
exports.searchMedia = searchMedia;
/**
 * Get media asset manifest (list of available files for a media item)
 * GET /asset/{nasa_id}
 */
const getAsset = async (nasaId) => {
    try {
        console.log(`Fetching asset manifest for: ${nasaId}`);
        const response = await axios_1.default.get(`${NASA_IMAGES_BASE_URL}/asset/${nasaId}`, { timeout: 30000 });
        console.log(`Asset Response Status: ${response.status}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching asset:", error.message);
        if (error.response) {
            throw new Error(`NASA Images API Error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error("Failed to fetch media asset");
    }
};
exports.getAsset = getAsset;
/**
 * Get metadata location for a media asset
 * GET /metadata/{nasa_id}
 */
const getMetadata = async (nasaId) => {
    try {
        console.log(`Fetching metadata for: ${nasaId}`);
        const response = await axios_1.default.get(`${NASA_IMAGES_BASE_URL}/metadata/${nasaId}`, { timeout: 30000 });
        console.log(`Metadata Response Status: ${response.status}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching metadata:", error.message);
        if (error.response) {
            throw new Error(`NASA Images API Error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error("Failed to fetch media metadata");
    }
};
exports.getMetadata = getMetadata;
/**
 * Get captions for a video asset
 * GET /captions/{nasa_id}
 */
const getCaptions = async (nasaId) => {
    try {
        console.log(`Fetching captions for: ${nasaId}`);
        const response = await axios_1.default.get(`${NASA_IMAGES_BASE_URL}/captions/${nasaId}`, { timeout: 30000 });
        console.log(`Captions Response Status: ${response.status}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching captions:", error.message);
        if (error.response) {
            throw new Error(`NASA Images API Error: ${error.response.status} - ${error.response.statusText}`);
        }
        throw new Error("Failed to fetch video captions");
    }
};
exports.getCaptions = getCaptions;
