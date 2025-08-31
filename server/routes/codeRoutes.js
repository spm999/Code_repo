const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");

const {
  createCodeFile,
  uploadCodeVersion,
  getCodeFiles,
  getCodeFile,
  updateCodeFile,
  adminApproveVersion,
  adminRejectVersion,
  deleteCodeFile,
  getSubmittedCode,
  getUserCodeFiles
} = require("../controllers/codeController");

const { protectBoth, protectUser, protectAdmin } = require("../middlewares/authMiddleware");

// ------------------ PUBLIC / USER ROUTES ------------------
// All logged-in users (developers & admins) can view code files
router.get("/files", protectBoth, getCodeFiles);
router.get("/files/:id", protectBoth, getCodeFile);
// Add this route to your codeRoutes.js
router.get("/user/files", protectUser, getUserCodeFiles);

router.post(
  "/files",
  protectUser,
  upload.fields([
    { name: "codeFile", maxCount: 1 },
    // { name: "codeContent", maxCount: 1 }
  ]),
  createCodeFile
);

// Upload new version for an existing code file
router.post("/files/:id/upload", protectUser, upload.single("codeFile"), uploadCodeVersion);

// Update code file metadata
router.put("/files/:id", protectUser, updateCodeFile);

// ------------------ ADMIN ROUTES ------------------
// Admin-only routes for approving/rejecting code versions
router.post("/versions/:versionId/approve", protectAdmin, adminApproveVersion);
router.post("/versions/:versionId/reject", protectAdmin, adminRejectVersion);

// Delete code file (admin only)
router.delete("/files/:id", protectAdmin, deleteCodeFile);

// Get all submitted code (admin dashboard)
router.get("/submitted", protectAdmin, getSubmittedCode);

module.exports = router;
