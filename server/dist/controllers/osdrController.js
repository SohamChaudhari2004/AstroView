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
exports.previewFile = exports.downloadFile = exports.getExperimentById = exports.getExperiments = exports.getMissionById = exports.getMissions = exports.getStudyMetadata = exports.getStudyFiles = exports.searchDatasets = void 0;
const osdrService = __importStar(require("../services/osdrService"));
/**
 * Search OSDR datasets
 * GET /api/osdr/search?term=...&from=...&size=...&type=...
 */
const searchDatasets = async (req, res) => {
    try {
        const { term, from, size, type, sort, order, ffield, fvalue } = req.query;
        console.log("OSDR Search request:", {
            term,
            from,
            size,
            type,
            sort,
            order,
            ffield,
            fvalue,
        });
        const data = await osdrService.searchOSDRDatasets({
            term: term,
            from: from ? parseInt(from) : undefined,
            size: size ? parseInt(size) : undefined,
            type: type,
            sort: sort,
            order: order,
            ffield: ffield,
            fvalue: fvalue,
        });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in searchDatasets controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to search OSDR datasets",
        });
    }
};
exports.searchDatasets = searchDatasets;
/**
 * Get study files
 * GET /api/osdr/studies/:studyIds/files
 */
const getStudyFiles = async (req, res) => {
    try {
        const { studyIds } = req.params;
        const { page, size, all_files } = req.query;
        console.log("Study files request:", { studyIds, page, size, all_files });
        if (!studyIds) {
            return res.status(400).json({
                success: false,
                error: "Study IDs are required",
            });
        }
        const data = await osdrService.getStudyFiles({
            studyIds: Array.isArray(studyIds) ? studyIds[0] : studyIds,
            page: page ? parseInt(page) : undefined,
            size: size ? parseInt(size) : undefined,
            all_files: all_files === "true",
        });
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getStudyFiles controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch study files",
        });
    }
};
exports.getStudyFiles = getStudyFiles;
/**
 * Get study metadata
 * GET /api/osdr/studies/:studyId/metadata
 */
const getStudyMetadata = async (req, res) => {
    try {
        const { studyId } = req.params;
        console.log("Study metadata request:", { studyId });
        if (!studyId) {
            return res.status(400).json({
                success: false,
                error: "Study ID is required",
            });
        }
        const data = await osdrService.getStudyMetadata(Array.isArray(studyId) ? studyId[0] : studyId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getStudyMetadata controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch study metadata",
        });
    }
};
exports.getStudyMetadata = getStudyMetadata;
/**
 * Get all missions
 * GET /api/osdr/missions
 */
const getMissions = async (req, res) => {
    try {
        console.log("Missions request");
        const missions = await osdrService.getAllMissions();
        res.json({
            success: true,
            data: missions,
        });
    }
    catch (error) {
        console.error("Error in getMissions controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch missions",
        });
    }
};
exports.getMissions = getMissions;
/**
 * Get mission by ID
 * GET /api/osdr/missions/:missionId
 */
const getMissionById = async (req, res) => {
    try {
        const { missionId } = req.params;
        console.log("Mission by ID request:", { missionId });
        if (!missionId) {
            return res.status(400).json({
                success: false,
                error: "Mission ID is required",
            });
        }
        const data = await osdrService.getMissionById(Array.isArray(missionId) ? missionId[0] : missionId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getMissionById controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch mission",
        });
    }
};
exports.getMissionById = getMissionById;
/**
 * Get all experiments
 * GET /api/osdr/experiments
 */
const getExperiments = async (req, res) => {
    try {
        console.log("Experiments request");
        const result = await osdrService.getAllExperiments();
        res.json({
            success: true,
            data: result.experiments,
            totalAvailable: result.totalAvailable,
        });
    }
    catch (error) {
        console.error("Error in getExperiments controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch experiments",
        });
    }
};
exports.getExperiments = getExperiments;
/**
 * Get experiment by ID
 * GET /api/osdr/experiments/:experimentId
 */
const getExperimentById = async (req, res) => {
    try {
        const { experimentId } = req.params;
        console.log("Experiment by ID request:", { experimentId });
        if (!experimentId) {
            return res.status(400).json({
                success: false,
                error: "Experiment ID is required",
            });
        }
        const data = await osdrService.getExperimentById(Array.isArray(experimentId) ? experimentId[0] : experimentId);
        res.json({
            success: true,
            data: data,
        });
    }
    catch (error) {
        console.error("Error in getExperimentById controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch experiment",
        });
    }
};
exports.getExperimentById = getExperimentById;
/**
 * Download a file from OSDR
 * GET /api/osdr/files/download?path=...
 */
const downloadFile = async (req, res) => {
    try {
        const { path: filePath } = req.query;
        if (!filePath || typeof filePath !== "string") {
            return res.status(400).json({
                success: false,
                error: "File path is required",
            });
        }
        console.log("File download request:", filePath);
        const response = await osdrService.downloadFile(filePath);
        // Extract filename from path
        const fileName = filePath.split("/").pop() || "download";
        // Forward content headers from OSDR
        if (response.headers["content-type"]) {
            res.setHeader("Content-Type", response.headers["content-type"]);
        }
        else {
            res.setHeader("Content-Type", "application/octet-stream");
        }
        if (response.headers["content-length"]) {
            res.setHeader("Content-Length", response.headers["content-length"]);
        }
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        // Pipe the stream
        response.data.pipe(res);
    }
    catch (error) {
        console.error("Error in downloadFile controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to download file",
        });
    }
};
exports.downloadFile = downloadFile;
/**
 * Preview a file from OSDR (inline in browser)
 * GET /api/osdr/files/preview?path=...
 */
const previewFile = async (req, res) => {
    try {
        const { path: filePath } = req.query;
        if (!filePath || typeof filePath !== "string") {
            return res.status(400).json({
                success: false,
                error: "File path is required",
            });
        }
        console.log("File preview request:", filePath);
        const response = await osdrService.downloadFile(filePath);
        const fileName = filePath.split("/").pop() || "preview";
        const ext = fileName.split(".").pop()?.toLowerCase() || "";
        // Map extensions to MIME types for preview
        const mimeMap = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            svg: "image/svg+xml",
            webp: "image/webp",
            bmp: "image/bmp",
            txt: "text/plain",
            csv: "text/csv",
            tsv: "text/tab-separated-values",
            json: "application/json",
            xml: "application/xml",
            html: "text/html",
            htm: "text/html",
            md: "text/markdown",
            log: "text/plain",
            yaml: "text/yaml",
            yml: "text/yaml",
            mp4: "video/mp4",
            webm: "video/webm",
            mp3: "audio/mpeg",
            wav: "audio/wav",
        };
        const contentType = mimeMap[ext] ||
            response.headers["content-type"] ||
            "application/octet-stream";
        res.setHeader("Content-Type", contentType);
        if (response.headers["content-length"]) {
            res.setHeader("Content-Length", response.headers["content-length"]);
        }
        res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
        response.data.pipe(res);
    }
    catch (error) {
        console.error("Error in previewFile controller:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to preview file",
        });
    }
};
exports.previewFile = previewFile;
