// models/AIAnalysis.js
const mongoose = require("mongoose");

const aiAnalysisSchema = new mongoose.Schema(
  {
    codeVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodeVersion",
      required: true,
    },
    summary: { type: String },
    complexity: { type: String, enum: ["Low", "Medium", "High"] },
    securityRisks: [{ type: String }],
    optimizationSuggestions: [{ type: String }],
    bestPractices: [{ type: String }],
    lastAnalyzed: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIAnalysis", aiAnalysisSchema);
