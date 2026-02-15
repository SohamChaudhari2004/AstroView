import express from "express";
import * as nasaMediaController from "../controllers/nasaMediaController";

const router = express.Router();

// Search NASA Image and Video Library
router.get("/search", nasaMediaController.searchMedia);

// Get asset manifest
router.get("/asset/:nasaId", nasaMediaController.getAsset);

// Get metadata
router.get("/metadata/:nasaId", nasaMediaController.getMetadata);

// Get video captions
router.get("/captions/:nasaId", nasaMediaController.getCaptions);

export default router;
