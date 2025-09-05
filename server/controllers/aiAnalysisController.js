// // controllers/aiAnalysisController.js
// const CodeVersion = require("../models/CodeVersion");
// const AIAnalysis = require("../models/AIAnalysis");
// const { analyzeCode } = require("../utils/aiService");

// // Only admins should use this
// exports.runAIAnalysis = async (req, res) => {
//   try {

//     const { versionId } = req.params;
//     const codeVersion = await CodeVersion.findById(versionId);

//     if (!codeVersion) {
//       return res.status(404).json({ success: false, message: "Code version not found" });
//     }

//     // 🔥 Assume code is already stored as text in DB, else fetch file
//     const codeContent = codeVersion.codeContent || "// Code not available";

//     // Call Gemini
//     const aiResponse = await analyzeCode(codeContent);

//     // 📝 Basic parsing (later we can use structured output from Gemini)
//     const analysis = new AIAnalysis({
//       codeVersion: codeVersion._id,
//       summary: aiResponse,
//       complexity: "Medium", // default fallback
//       securityRisks: [],    // could parse with regex if needed
//       optimizationSuggestions: [],
//       bestPractices: [],
//     });

//     await analysis.save();

//     res.status(201).json({
//       success: true,
//       message: "AI analysis completed",
//       data: analysis,
//     });
//   } catch (error) {
//     console.error("AI Analysis Error:", error);
//     res.status(500).json({ success: false, message: "AI Analysis failed: " + error.message });
//   }
// };


// controllers/aiAnalysisController.js
const CodeVersion = require("../models/CodeVersion");
const AIAnalysis = require("../models/AIAnalysis");
const { analyzeCode } = require("../utils/aiService");
const axios = require("axios"); // ✅ use axios to fetch from Cloudinary

// Only admins should use this
exports.runAIAnalysis = async (req, res) => {
  try {
    const { versionId } = req.params;
    const codeVersion = await CodeVersion.findById(versionId);

    if (!codeVersion) {
      return res.status(404).json({ success: false, message: "Code version not found" });
    }

    // ✅ Step 1: Fetch file content from Cloudinary
    let codeContent = "// Code not available";
    if (codeVersion.fileUrl) {
      const response = await axios.get(codeVersion.fileUrl);
      codeContent = response.data;
    }

    // ✅ Step 2: Call Gemini with fetched code
    const aiResponse = await analyzeCode(codeContent);

    // ✅ Step 3: Save AI analysis
    const analysis = new AIAnalysis({
      codeVersion: codeVersion._id,
      summary: aiResponse,
      complexity: "Medium", // later we can parse from aiResponse
      securityRisks: [],
      optimizationSuggestions: [],
      bestPractices: [],
    });

    await analysis.save();

    res.status(201).json({
      success: true,
      message: "AI analysis completed",
      data: analysis,
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res
      .status(500)
      .json({ success: false, message: "AI Analysis failed: " + error.message });
  }
};
