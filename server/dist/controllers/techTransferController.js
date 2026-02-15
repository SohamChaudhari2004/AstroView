"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTechTransferData = void 0;
const techTransferService_1 = require("../services/techTransferService");
/**
 * Controller to handle Tech Transfer API requests
 * Supports query parameters: patent, patent_issued, software, spinoff
 *
 * Example requests:
 * GET /api/tech-transfer?patent=engine
 * GET /api/tech-transfer?software=autonomous
 * GET /api/tech-transfer?spinoff=medical
 */
const getTechTransferData = async (req, res) => {
    try {
        console.log("[TechTransferController] Received request with query:", req.query);
        const { patent, patent_issued, software, spinoff } = req.query;
        // Validate that at least one query parameter is provided
        if (!patent && !patent_issued && !software && !spinoff) {
            return res.status(400).json({
                success: false,
                error: "At least one query parameter is required: patent, patent_issued, software, or spinoff",
                example: "/api/tech-transfer?patent=engine",
            });
        }
        // Prepare query parameters
        const queryParams = {};
        if (patent)
            queryParams.patent = patent.toString();
        if (patent_issued)
            queryParams.patent_issued = patent_issued.toString();
        if (software)
            queryParams.software = software.toString();
        if (spinoff)
            queryParams.spinoff = spinoff.toString();
        // Fetch data from NASA Tech Transfer API
        const data = await (0, techTransferService_1.fetchTechTransferData)(queryParams);
        console.log("[TechTransferController] Successfully fetched tech transfer data");
        res.status(200).json({
            success: true,
            data: data,
            query: queryParams,
        });
    }
    catch (error) {
        console.error("[TechTransferController] Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message || "Failed to fetch tech transfer data",
            details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
};
exports.getTechTransferData = getTechTransferData;
