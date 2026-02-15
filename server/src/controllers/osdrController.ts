import { Request, Response } from "express";
import * as osdrService from "../services/osdrService";

/**
 * Search OSDR datasets
 * GET /api/osdr/search?term=...&from=...&size=...&type=...
 */
export const searchDatasets = async (req: Request, res: Response) => {
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
      term: term as string,
      from: from ? parseInt(from as string) : undefined,
      size: size ? parseInt(size as string) : undefined,
      type: type as string,
      sort: sort as string,
      order: order as "ASC" | "DESC",
      ffield: ffield as string,
      fvalue: fvalue as string,
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in searchDatasets controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to search OSDR datasets",
    });
  }
};

/**
 * Get study files
 * GET /api/osdr/studies/:studyIds/files
 */
export const getStudyFiles = async (req: Request, res: Response) => {
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
      page: page ? parseInt(page as string) : undefined,
      size: size ? parseInt(size as string) : undefined,
      all_files: all_files === "true",
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getStudyFiles controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch study files",
    });
  }
};

/**
 * Get study metadata
 * GET /api/osdr/studies/:studyId/metadata
 */
export const getStudyMetadata = async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;

    console.log("Study metadata request:", { studyId });

    if (!studyId) {
      return res.status(400).json({
        success: false,
        error: "Study ID is required",
      });
    }

    const data = await osdrService.getStudyMetadata(
      Array.isArray(studyId) ? studyId[0] : studyId,
    );

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getStudyMetadata controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch study metadata",
    });
  }
};

/**
 * Get all missions
 * GET /api/osdr/missions
 */
export const getMissions = async (req: Request, res: Response) => {
  try {
    console.log("Missions request");

    const missions = await osdrService.getAllMissions();

    res.json({
      success: true,
      data: missions,
    });
  } catch (error: any) {
    console.error("Error in getMissions controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch missions",
    });
  }
};

/**
 * Get mission by ID
 * GET /api/osdr/missions/:missionId
 */
export const getMissionById = async (req: Request, res: Response) => {
  try {
    const { missionId } = req.params;

    console.log("Mission by ID request:", { missionId });

    if (!missionId) {
      return res.status(400).json({
        success: false,
        error: "Mission ID is required",
      });
    }

    const data = await osdrService.getMissionById(
      Array.isArray(missionId) ? missionId[0] : missionId,
    );

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getMissionById controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch mission",
    });
  }
};

/**
 * Get all experiments
 * GET /api/osdr/experiments
 */
export const getExperiments = async (req: Request, res: Response) => {
  try {
    console.log("Experiments request");

    const result = await osdrService.getAllExperiments();

    res.json({
      success: true,
      data: result.experiments,
      totalAvailable: result.totalAvailable,
    });
  } catch (error: any) {
    console.error("Error in getExperiments controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch experiments",
    });
  }
};

/**
 * Get experiment by ID
 * GET /api/osdr/experiments/:experimentId
 */
export const getExperimentById = async (req: Request, res: Response) => {
  try {
    const { experimentId } = req.params;

    console.log("Experiment by ID request:", { experimentId });

    if (!experimentId) {
      return res.status(400).json({
        success: false,
        error: "Experiment ID is required",
      });
    }

    const data = await osdrService.getExperimentById(
      Array.isArray(experimentId) ? experimentId[0] : experimentId,
    );

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getExperimentById controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch experiment",
    });
  }
};

/**
 * Download a file from OSDR
 * GET /api/osdr/files/download?path=...
 */
export const downloadFile = async (req: Request, res: Response) => {
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
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
    }
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the stream
    response.data.pipe(res);
  } catch (error: any) {
    console.error("Error in downloadFile controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to download file",
    });
  }
};

/**
 * Preview a file from OSDR (inline in browser)
 * GET /api/osdr/files/preview?path=...
 */
export const previewFile = async (req: Request, res: Response) => {
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
    const mimeMap: Record<string, string> = {
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

    const contentType =
      mimeMap[ext] ||
      response.headers["content-type"] ||
      "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    if (response.headers["content-length"]) {
      res.setHeader("Content-Length", response.headers["content-length"]);
    }
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);

    response.data.pipe(res);
  } catch (error: any) {
    console.error("Error in previewFile controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to preview file",
    });
  }
};
