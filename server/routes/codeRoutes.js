// const express = require("express");
// const router = express.Router();
// const { upload } = require("../utils/cloudinary");

// const {
//   createCodeFile,
//   uploadCodeVersion,
//   getCodeFiles,
//   getCodeFile,
//   updateCodeFile,
//   adminApprove,
//   deleteCodeFile,
//   getSubmittedCode,
//   adminReject
// } = require("../controllers/codeController");

// const { protectBoth, protectUser, protectAdmin,  admin } = require("../middlewares/authMiddleware");

// // All logged-in users (developers & admins) can view
// router.get("/files", protectBoth, getCodeFiles);
// router.get("/files/:id", protectBoth, getCodeFile);

// // Only logged-in users can create or edit code
// router.post("/files", protectUser, createCodeFile);
// router.post("/files/:id/upload", protectUser, upload.single("codeFile"), uploadCodeVersion);
// router.put("/files/:id", protectUser, updateCodeFile);

// // Admin-only routes
// router.post("/files/:id/admin-approve", protectAdmin, adminApprove);
// router.post("/files/:id/admin-reject", protectAdmin, admin, adminReject);

// router.delete("/files/:id", protectAdmin, admin, deleteCodeFile);
// router.get("/submitted", protectAdmin, admin, getSubmittedCode);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { upload } = require("../utils/cloudinary");

// const {
//   createCodeFile,
//   uploadCodeVersion,
//   getCodeFiles,
//   getCodeFile,
//   updateCodeFile,
//   adminApproveVersion,
//   adminRejectVersion,
//   deleteCodeFile,
//   getSubmittedCode
// } = require("../controllers/codeController");

// const { protectBoth, protectUser, protectAdmin } = require("../middlewares/authMiddleware");

// // ------------------ PUBLIC / USER ROUTES ------------------
// // All logged-in users (developers & admins) can view code files
// router.get("/files", protectBoth, getCodeFiles);
// router.get("/files/:id", protectBoth, getCodeFile);

// // Only logged-in users can create or edit code
// router.post("/files", protectUser, createCodeFile);
// router.post("/files/:id/upload", protectUser, upload.single("codeFile"), uploadCodeVersion);
// router.put("/files/:id", protectUser, updateCodeFile);

// // ------------------ ADMIN ROUTES ------------------
// // Admin-only routes for approving/rejecting code versions
// router.post("/versions/:versionId/approve", protectAdmin, adminApproveVersion);
// router.post("/versions/:versionId/reject", protectAdmin, adminRejectVersion);

// // Delete code file (admin only)
// router.delete("/files/:id", protectAdmin, deleteCodeFile);

// // Get all submitted code (admin dashboard)
// router.get("/submitted", protectAdmin, getSubmittedCode);

// module.exports = router;


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
  getSubmittedCode
} = require("../controllers/codeController");

const { protectBoth, protectUser, protectAdmin } = require("../middlewares/authMiddleware");

// ------------------ PUBLIC / USER ROUTES ------------------
// All logged-in users (developers & admins) can view code files
router.get("/files", protectBoth, getCodeFiles);
router.get("/files/:id", protectBoth, getCodeFile);

// Only logged-in users can create or edit code

// Create code file: accepts either a file upload or code content from frontend
// router.post(
//   "/files",
//   protectUser,
//   upload.single("codeFile"), // optional, in case user uploads a file
//   createCodeFile
// );
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
