import { Router } from "express";
import axios from "axios";

const router = Router();

// Endpoint to get Mistral API key (for client-side agent)
router.get("/config", (req, res) => {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Mistral API key not configured" });
  }
  res.json({ apiKey });
});

// Chat endpoint that can proxy requests if needed
router.post("/message", async (req, res) => {
  try {
    const { message, history } = req.body;

    // This endpoint can be used as a fallback or for server-side processing
    res.json({
      success: true,
      message: "Client-side agent should handle this",
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

export default router;
