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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaptions = exports.getMetadata = exports.getAsset = exports.searchMedia = void 0;
const nasaMediaService = __importStar(require("../services/nasaMediaService"));
/**
 * Search NASA Image and Video Library
 * GET /api/nasa-media/search?q=...&media_type=...&page=...
 */
const searchMedia = async (req, res) => {
    try {
        const { q, center, description, keywords, media_type, nasa_id, page, title, year_start, year_end, } = req.query;
        console.log("NASA Media search request:", { q, media_type, page });
        if (!q && !nasa_id && !title && !keywords && !center && !description) {
            return res.status(400).json({
                success: false,
                error: "At least one search parameter is required (q, nasa_id, title, keywords, center, or description)",
            });
        }
        const data = await nasaMediaService.searchMedia({
            q: q,
            center: center,
            description: description,
            keywords: keywords,
            media_type: media_type,
            nasa_id: nasa_id,
            page: page ? parseInt(page) : undefined,
            title: title,
            year_start: year_start,
            year_end: year_end,
        });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in searchMedia controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to search NASA media",
        });
    }
};
exports.searchMedia = searchMedia;
/**
 * Get asset manifest
 * GET /api/nasa-media/asset/:nasaId
 */
const getAsset = async (req, res) => {
    try {
        const { nasaId } = req.params;
        if (!nasaId) {
            return res.status(400).json({
                success: false,
                error: "NASA ID is required",
            });
        }
        console.log("Asset request:", nasaId);
        const data = await nasaMediaService.getAsset(nasaId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getAsset controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch asset",
        });
    }
};
exports.getAsset = getAsset;
/**
 * Get metadata location
 * GET /api/nasa-media/metadata/:nasaId
 */
const getMetadata = async (req, res) => {
    try {
        const { nasaId } = req.params;
        if (!nasaId) {
            return res.status(400).json({
                success: false,
                error: "NASA ID is required",
            });
        }
        console.log("Metadata request:", nasaId);
        const data = await nasaMediaService.getMetadata(nasaId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getMetadata controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch metadata",
        });
    }
};
exports.getMetadata = getMetadata;
/**
 * Get video captions
 * GET /api/nasa-media/captions/:nasaId
 */
const getCaptions = async (req, res) => {
    try {
        const { nasaId } = req.params;
        if (!nasaId) {
            return res.status(400).json({
                success: false,
                error: "NASA ID is required",
            });
        }
        console.log("Captions request:", nasaId);
        const data = await nasaMediaService.getCaptions(nasaId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getCaptions controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch captions",
        });
    }
};
exports.getCaptions = getCaptions;
