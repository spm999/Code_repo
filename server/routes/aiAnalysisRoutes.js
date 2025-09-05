// routes/aiAnalysisRoutes.js
const express = require("express");
const router = express.Router();
const { runAIAnalysis } = require("../controllers/aiAnalysisController");

const { protectAdmin, admin } = require("../middlewares/authMiddleware");
// POST /api/ai/analyze/:versionId
router.post("/analyze/:versionId", protectAdmin, admin, runAIAnalysis);

module.exports = router;
