import express from "express";
import * as osdrController from "../controllers/osdrController";

const router = express.Router();

// Search datasets
router.get("/search", osdrController.searchDatasets);

// Study files and metadata
router.get("/studies/:studyIds/files", osdrController.getStudyFiles);
router.get("/studies/:studyId/metadata", osdrController.getStudyMetadata);

// Missions
router.get("/missions", osdrController.getMissions);
router.get("/missions/:missionId", osdrController.getMissionById);

// Experiments
router.get("/experiments", osdrController.getExperiments);
router.get("/experiments/:experimentId", osdrController.getExperimentById);

// File download proxy
router.get("/files/download", osdrController.downloadFile);
router.get("/files/preview", osdrController.previewFile);

export default router;
