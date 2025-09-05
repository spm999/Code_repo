// routes/aiAnalysisRoutes.js
const express = require("express");
const router = express.Router();
const { runAIAnalysis } = require("../controllers/aiAnalysisController");
const { protectAdmin } = require("../middlewares/authMiddleware"); // assuming you have auth

// POST /api/ai/analyze/:versionId
router.post("/analyze/:versionId", protectAdmin, runAIAnalysis);

module.exports = router;
