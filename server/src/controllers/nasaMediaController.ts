import { Request, Response } from "express";
import * as nasaMediaService from "../services/nasaMediaService";

/**
 * Search NASA Image and Video Library
 * GET /api/nasa-media/search?q=...&media_type=...&page=...
 */
export const searchMedia = async (req: Request, res: Response) => {
  try {
    const {
      q,
      center,
      description,
      keywords,
      media_type,
      nasa_id,
      page,
      title,
      year_start,
      year_end,
    } = req.query;

    console.log("NASA Media search request:", { q, media_type, page });

    if (!q && !nasa_id && !title && !keywords && !center && !description) {
      return res.status(400).json({
        success: false,
        error:
          "At least one search parameter is required (q, nasa_id, title, keywords, center, or description)",
      });
    }

    const data = await nasaMediaService.searchMedia({
      q: q as string,
      center: center as string,
      description: description as string,
      keywords: keywords as string,
      media_type: media_type as "image" | "video" | "audio",
      nasa_id: nasa_id as string,
      page: page ? parseInt(page as string) : undefined,
      title: title as string,
      year_start: year_start as string,
      year_end: year_end as string,
    });

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in searchMedia controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to search NASA media",
    });
  }
};

/**
 * Get asset manifest
 * GET /api/nasa-media/asset/:nasaId
 */
export const getAsset = async (req: Request, res: Response) => {
  try {
    const { nasaId } = req.params;

    if (!nasaId) {
      return res.status(400).json({
        success: false,
        error: "NASA ID is required",
      });
    }

    console.log("Asset request:", nasaId);

    const data = await nasaMediaService.getAsset(nasaId as string);

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getAsset controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch asset",
    });
  }
};

/**
 * Get metadata location
 * GET /api/nasa-media/metadata/:nasaId
 */
export const getMetadata = async (req: Request, res: Response) => {
  try {
    const { nasaId } = req.params;

    if (!nasaId) {
      return res.status(400).json({
        success: false,
        error: "NASA ID is required",
      });
    }

    console.log("Metadata request:", nasaId);

    const data = await nasaMediaService.getMetadata(nasaId as string);

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getMetadata controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch metadata",
    });
  }
};

/**
 * Get video captions
 * GET /api/nasa-media/captions/:nasaId
 */
export const getCaptions = async (req: Request, res: Response) => {
  try {
    const { nasaId } = req.params;

    if (!nasaId) {
      return res.status(400).json({
        success: false,
        error: "NASA ID is required",
      });
    }

    console.log("Captions request:", nasaId);

    const data = await nasaMediaService.getCaptions(nasaId as string);

    res.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    console.error("Error in getCaptions controller:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch captions",
    });
  }
};
