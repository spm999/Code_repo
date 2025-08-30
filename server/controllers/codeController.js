// const CodeFile = require("../models/CodeFile");
// const CodeVersion = require("../models/CodeVersion");
// const User = require("../models/User");
// const { sendAdminNotification } = require("../utils/emailService"); // utility to send emails
// const mongoose = require("mongoose");

// // Create a new code file
// exports.createCodeFile = async (req, res) => {
//   try {
//     const { title, description, tags, language } = req.body;
//     const codeFile = await CodeFile.create({
//       title,
//       description,
//       owner: req.user._id,
//       lastUpdatedBy: req.user._id,
//       tags,
//       language,
//       status: "draft",
//       pendingStatus: "none"
//     });

//     return res.status(201).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Upload a new version
// exports.uploadCodeVersion = async (req, res) => {
//   try {
//     const { id } = req.params; // codeFile id
//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     // Create new version
//     const versionNumber = codeFile.versions.length + 1;
//     const newVersion = await CodeVersion.create({
//       codeFile: codeFile._id,
//       versionNumber,
//       uploadedBy: req.user._id,
//       fileUrl: req.file.path, // cloudinary or S3 URL
//       language: codeFile.language,
//       tags: codeFile.tags
//     });

//     // Update code file metadata
//     codeFile.versions.push(newVersion._id);
//     codeFile.lastUpdated = new Date();
//     codeFile.lastUpdatedBy = req.user._id;
//     codeFile.pendingStatus = "awaiting_admin";
//     codeFile.status = "submitted";
//     await codeFile.save();

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       sendAdminNotification(admin.email, `Code file "${codeFile.title}" has a new version uploaded.`);
//     });

//     return res.status(200).json({ success: true, data: newVersion });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Get all code files (developer & admin)
// exports.getCodeFiles = async (req, res) => {
//   try {
//     const codeFiles = await CodeFile.find()
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate("collaborators", "username email")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });
//     res.status(200).json({ success: true, data: codeFiles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Get a single code file
// exports.getCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id)
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate("collaborators", "username email")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Update code file metadata (title, description, tags, language)
// exports.updateCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, tags, language } = req.body;

//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     codeFile.title = title || codeFile.title;
//     codeFile.description = description || codeFile.description;
//     codeFile.tags = tags || codeFile.tags;
//     codeFile.language = language || codeFile.language;
//     codeFile.lastUpdated = new Date();
//     codeFile.lastUpdatedBy = req.user._id;
//     codeFile.pendingStatus = "awaiting_admin";
//     codeFile.status = "submitted";

//     await codeFile.save();

//     // Notify admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       sendAdminNotification(admin.email, `Code file "${codeFile.title}" has been edited and needs verification.`);
//     });

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Admin approves code file
// exports.adminApprove = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     codeFile.status = "approved";
//     codeFile.pendingStatus = "none";
//     codeFile.verifiedBy = req.user._id;
//     codeFile.lastUpdated = new Date();
//     await codeFile.save();

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Delete code file (admin only)
// exports.deleteCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     await CodeVersion.deleteMany({ codeFile: id });
//     await codeFile.deleteOne();

//     res.status(200).json({ success: true, message: "Code file deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // Get all submitted code for admin dashboard
// exports.getSubmittedCode = async (req, res) => {
//   try {
//     const codeFiles = await CodeFile.find({ status: "submitted" })
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });
//     res.status(200).json({ success: true, data: codeFiles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// const CodeFile = require("../models/CodeFile");
// const CodeVersion = require("../models/CodeVersion");
// const User = require("../models/User");
// const { sendEmail, emailTemplates } = require("../utils/emailService");

// // ------------------ CREATE CODE FILE ------------------
// exports.createCodeFile = async (req, res) => {
//   try {
//     const { title, description, tags, language, collaborators } = req.body;

//     const codeFile = await CodeFile.create({
//       title,
//       description,
//       owner: req.user._id,
//       lastUpdatedBy: req.user._id,
//       collaborators: collaborators || [],
//       tags,
//       language: language || "javascript",
//       status: "submitted",
//       pendingStatus: "awaiting_admin",
//     });

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.adminApprovalRequest(codeFile, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(201).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ UPLOAD CODE VERSION ------------------
// exports.uploadCodeVersion = async (req, res) => {
//   try {
//     const { id } = req.params; // codeFile id
//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     // Create new version
//     const versionNumber = codeFile.versions.length + 1;
//     const newVersion = await CodeVersion.create({
//       codeFile: codeFile._id,
//       versionNumber,
//       uploadedBy: req.user._id,
//       fileUrl: req.file.path, // cloud storage URL
//       language: codeFile.language,
//       tags: codeFile.tags,
//     });

//     // Update code file metadata
//     codeFile.versions.push(newVersion._id);
//     codeFile.lastUpdated = new Date();
//     codeFile.lastUpdatedBy = req.user._id;
//     codeFile.status = "submitted";
//     codeFile.pendingStatus = "awaiting_admin";
//     await codeFile.save();

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.versionSubmitted(codeFile, newVersion, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(200).json({ success: true, data: newVersion });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ GET ALL CODE FILES ------------------
// exports.getCodeFiles = async (req, res) => {
//   try {
//     const codeFiles = await CodeFile.find()
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate("collaborators", "username email")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });

//     res.status(200).json({ success: true, data: codeFiles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ GET SINGLE CODE FILE ------------------
// exports.getCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id)
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate("collaborators", "username email")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });

//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ UPDATE CODE FILE ------------------
// exports.updateCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, tags, language, collaborators } = req.body;

//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     // Only owner or collaborator can edit
//     if (codeFile.owner.toString() !== req.user._id.toString() &&
//         !codeFile.collaborators.includes(req.user._id)) {
//       return res.status(403).json({ message: "Not authorized to edit this file" });
//     }

//     codeFile.title = title || codeFile.title;
//     codeFile.description = description || codeFile.description;
//     codeFile.tags = tags || codeFile.tags;
//     codeFile.language = language || codeFile.language;
//     codeFile.collaborators = collaborators || codeFile.collaborators;
//     codeFile.lastUpdated = new Date();
//     codeFile.lastUpdatedBy = req.user._id;
//     codeFile.status = "submitted";
//     codeFile.pendingStatus = "awaiting_admin";

//     await codeFile.save();

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.versionSubmitted(codeFile, { version: "updated" }, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ ADMIN APPROVE ------------------
// exports.adminApprove = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id).populate("owner");
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     codeFile.status = "approved";
//     codeFile.pendingStatus = "none";
//     codeFile.verifiedBy = req.user._id;
//     codeFile.lastUpdated = new Date();
//     await codeFile.save();

//     // Notify developer
//     const email = emailTemplates.fileApproved(codeFile, codeFile.owner, req.user);
//     sendEmail(codeFile.owner.email, email.subject, email.html);

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// //==--------------------Admin reject ----------------------------------

// // Admin rejects code file
// exports.adminReject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { comments } = req.body; // Optional comments from admin
//     const codeFile = await CodeFile.findById(id).populate("owner", "username email");
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     codeFile.status = "rejected";
//     codeFile.pendingStatus = "none";
//     codeFile.verifiedBy = req.user._id;
//     codeFile.lastUpdated = new Date();
//     await codeFile.save();

//     // Notify developer about rejection
//     const { sendEmail, emailTemplates } = require("../utils/emailService");
//     const email = emailTemplates.fileRejected(codeFile, codeFile.owner, req.user, comments);
//     sendEmail(codeFile.owner.email, email.subject, email.html);

//     res.status(200).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// // ------------------ DELETE CODE FILE (ADMIN ONLY) ------------------
// exports.deleteCodeFile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const codeFile = await CodeFile.findById(id);
//     if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

//     await CodeVersion.deleteMany({ codeFile: id });
//     await codeFile.deleteOne();

//     res.status(200).json({ success: true, message: "Code file deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// // ------------------ GET SUBMITTED CODE (ADMIN DASHBOARD) ------------------
// exports.getSubmittedCode = async (req, res) => {
//   try {
//     const codeFiles = await CodeFile.find({ status: "submitted" })
//       .populate("owner", "username email")
//       .populate("lastUpdatedBy", "username")
//       .populate("verifiedBy", "username")
//       .populate({
//         path: "versions",
//         populate: { path: "uploadedBy reviewedBy", select: "username email" }
//       });

//     res.status(200).json({ success: true, data: codeFiles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

const CodeFile = require("../models/CodeFile");
const CodeVersion = require("../models/CodeVersion");
const User = require("../models/User");
const { sendEmail, emailTemplates } = require("../utils/emailService");

// ------------------ CREATE CODE FILE ------------------
// exports.createCodeFile = async (req, res) => {
//   try {
//     const { title, description, tags, language } = req.body;

//     const codeFile = await CodeFile.create({
//       title,
//       description,
//       owner: req.user._id,
//       lastUpdatedBy: req.user._id,
//       tags,
//       language: language || "javascript",
//       status: "submitted",
//       pendingStatus: "awaiting_admin",
//     });

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.adminApprovalRequest(codeFile, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(201).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// exports.createCodeFile = async (req, res) => {
//   try {
//     const { title, description, tags, language } = req.body;

//     if (!req.file && !req.body.codeContent) {
//       return res.status(400).json({ success: false, message: "Code file or code content is required" });
//     }

//     // Create the code file entry
//     const codeFile = await CodeFile.create({
//       title,
//       description,
//       owner: req.user._id,
//       lastUpdatedBy: req.user._id,
//       tags,
//       language: language || "javascript",
//       status: "submitted",
//       pendingStatus: "awaiting_admin",
//     });

//     let fileUrl;
//     let fileSize;

//     // If file uploaded from frontend
//     if (req.file) {
//       fileUrl = req.file.path; // Cloudinary / S3 URL
//       fileSize = req.file.size;
//     } 
//     // If code content sent as text (e.g., from editor)
//     else if (req.body.codeContent) {
//       const { codeContent } = req.body;
//       // You can upload codeContent to cloud storage or just store as a small file URL/text
//       // Here, let's assume we store it as a text file in cloud:
//       const uploadedFile = await uploadCodeContentToCloud(codeContent, title); 
//       fileUrl = uploadedFile.url;
//       fileSize = uploadedFile.size;
//     }

//     // Create the first version
//     const codeVersion = await CodeVersion.create({
//       codeFile: codeFile._id,
//       versionNumber: 1,
//       uploadedBy: req.user._id,
//       fileUrl,
//       fileSize,
//       language: language || "javascript",
//       tags: tags || [],
//     });

//     // Link version to codeFile
//     codeFile.versions.push(codeVersion._id);
//     await codeFile.save();

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.adminApprovalRequest(codeFile, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(201).json({ success: true, data: codeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// exports.createCodeFile = async (req, res) => {
//   try {
//     // Extract text fields from form data
//     const { title, description, tags, language } = req.body;

//     // Check if title is provided
//     if (!title) {
//       return res.status(400).json({ success: false, message: "Title is required" });
//     }

//     // Check if either file or code content is provided
//     const codeFile = req.files && req.files['codeFile'] ? req.files['codeFile'][0] : null;
//     const codeContentFile = req.files && req.files['codeContent'] ? req.files['codeContent'][0] : null;
    
//     if (!codeFile && !codeContentFile && !req.body.codeContent) {
//       return res.status(400).json({ success: false, message: "Code file or code content is required" });
//     }

//     // Create the code file entry
//     const newCodeFile = await CodeFile.create({
//       title,
//       description: description || "",
//       owner: req.user._id,
//       lastUpdatedBy: req.user._id,
//       tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
//       language: language || "javascript",
//       status: "submitted",
//       pendingStatus: "awaiting_admin",
//     });

//     let fileUrl;
//     let fileSize;

//     // If file uploaded from frontend
//     if (codeFile) {
//       fileUrl = codeFile.path; // Cloudinary / S3 URL
//       fileSize = codeFile.size;
//     } 
//     // If code content sent as text file
//     else if (codeContentFile) {
//       fileUrl = codeContentFile.path;
//       fileSize = codeContentFile.size;
//     }
//     // If code content sent as text (e.g., from editor)
//     else if (req.body.codeContent) {
//       const { codeContent } = req.body;
//       // Upload codeContent to cloud storage
//       // You'll need to implement this function based on your cloud provider
//       const uploadedFile = await uploadCodeContentToCloud(codeContent, title); 
//       fileUrl = uploadedFile.url;
//       fileSize = uploadedFile.size;
//     }

//     // Create the first version
//     const codeVersion = await CodeVersion.create({
//       codeFile: newCodeFile._id,
//       versionNumber: 1,
//       uploadedBy: req.user._id,
//       fileUrl,
//       fileSize,
//       language: language || "javascript",
//       tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
//     });

//     // Link version to codeFile
//     newCodeFile.versions.push(codeVersion._id);
//     await newCodeFile.save();

//     // Notify all admins
//     const admins = await User.find({ role: "admin" });
//     admins.forEach(admin => {
//       const email = emailTemplates.adminApprovalRequest(newCodeFile, admin, req.user);
//       sendEmail(admin.email, email.subject, email.html);
//     });

//     res.status(201).json({ success: true, data: newCodeFile });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


exports.createCodeFile = async (req, res) => {
  try {
    // Extract text fields from form data
const { title, description, tags, language } = req.body;
console.log('Title:', title);
console.log('Description:', description);
console.log('Tags:', tags);
console.log('Language:', language);





    // Check if title is provided
    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Check if either file or code content is provided
    const hasCodeFile = req.files && req.files['codeFile'] && req.files['codeFile'][0];
    const hasCodeContentFile = req.files && req.files['codeContent'] && req.files['codeContent'][0];
    const hasCodeContentText = codeContent && codeContent.trim() !== '';
    
    if (!hasCodeFile && !hasCodeContentFile && !hasCodeContentText) {
      return res.status(400).json({ success: false, message: "Code file or code content is required" });
    }

    // Create the code file entry
    const newCodeFile = await CodeFile.create({
      title,
      description: description || "",
      owner: req.user._id,
      lastUpdatedBy: req.user._id,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : []) : [],
      language: language || "javascript",
      status: "submitted",
      pendingStatus: "awaiting_admin",
    });

    let fileUrl;
    let fileSize;

    // If file uploaded from PC
    if (hasCodeFile) {
      const codeFile = req.files['codeFile'][0];
      console.log('File data:');
console.log('Filename:', codeFile.originalname);
console.log('File size:', codeFile.size);
console.log('File type:', codeFile.mimetype);
      // Upload to cloud storage (implement your cloud upload logic here)
      const cloudFile = await uploadToCloudStorage(codeFile);
      fileUrl = cloudFile.url;
      fileSize = cloudFile.size;
    } 
    // If code content file uploaded
    else if (hasCodeContentFile) {
      const contentFile = req.files['codeContent'][0];
      const cloudFile = await uploadToCloudStorage(contentFile);
      fileUrl = cloudFile.url;
      fileSize = cloudFile.size;
    }
    // If code content sent as text (from editor)
    else if (hasCodeContentText) {
      // Create a text file from the code content
      const cloudFile = await createTextFileFromContent(codeContent, title);
      fileUrl = cloudFile.url;
      fileSize = cloudFile.size;
    }

    // Create the first version
    const codeVersion = await CodeVersion.create({
      codeFile: newCodeFile._id,
      versionNumber: 1,
      uploadedBy: req.user._id,
      fileUrl,
      fileSize,
      language: language || "javascript",
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : []) : [],
    });

    // Link version to codeFile
    newCodeFile.versions.push(codeVersion._id);
    await newCodeFile.save();

    // Notify all admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      const email = emailTemplates.adminApprovalRequest(newCodeFile, admin, req.user);
      sendEmail(admin.email, email.subject, email.html);
    }

    res.status(201).json({ success: true, data: newCodeFile });
  } catch (error) {
    console.error("Error creating code file:", error);
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};


// ------------------ UPLOAD CODE VERSION ------------------
exports.uploadCodeVersion = async (req, res) => {
  try {
    const { id } = req.params; // codeFile id
    const codeFile = await CodeFile.findById(id);
    if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });
    if (!req.file) return res.status(400).json({ success: false, message: "Code file upload required" });

    const versionNumber = codeFile.versions.length + 1;

    const newVersion = await CodeVersion.create({
      codeFile: codeFile._id,
      versionNumber,
      uploadedBy: req.user._id,
      fileUrl: req.file.path,
      language: codeFile.language,
      tags: codeFile.tags,
      reviewStatus: "pending",
    });

    codeFile.versions.push(newVersion._id);
    codeFile.lastUpdated = new Date();
    codeFile.lastUpdatedBy = req.user._id;
    codeFile.status = "submitted";
    codeFile.pendingStatus = "awaiting_admin";
    await codeFile.save();

    // Notify all admins
    const admins = await User.find({ role: "admin" });
    admins.forEach(admin => {
      const email = emailTemplates.versionSubmitted(codeFile, newVersion, admin, req.user);
      sendEmail(admin.email, email.subject, email.html);
    });

    res.status(201).json({ success: true, data: newVersion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ GET ALL CODE FILES ------------------
exports.getCodeFiles = async (req, res) => {
  try {
    const codeFiles = await CodeFile.find()
      .populate("owner", "username email")
      .populate("lastUpdatedBy", "username")
      .populate("verifiedBy", "username")
      .populate({
        path: "versions",
        populate: { path: "uploadedBy reviewedBy", select: "username email" }
      });

    res.status(200).json({ success: true, data: codeFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ GET SINGLE CODE FILE ------------------
exports.getCodeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const codeFile = await CodeFile.findById(id)
      .populate("owner", "username email")
      .populate("lastUpdatedBy", "username")
      .populate("verifiedBy", "username")
      .populate({
        path: "versions",
        populate: { path: "uploadedBy reviewedBy", select: "username email" }
      });

    if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

    res.status(200).json({ success: true, data: codeFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ UPDATE CODE FILE ------------------
exports.updateCodeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, language } = req.body;

    const codeFile = await CodeFile.findById(id);
    if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

    if (codeFile.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this file" });
    }

    codeFile.title = title || codeFile.title;
    codeFile.description = description || codeFile.description;
    codeFile.tags = tags || codeFile.tags;
    codeFile.language = language || codeFile.language;
    codeFile.lastUpdated = new Date();
    codeFile.lastUpdatedBy = req.user._id;
    codeFile.status = "submitted";
    codeFile.pendingStatus = "awaiting_admin";

    await codeFile.save();

    const admins = await User.find({ role: "admin" });
    admins.forEach(admin => {
      const email = emailTemplates.versionSubmitted(codeFile, { version: "updated" }, admin, req.user);
      sendEmail(admin.email, email.subject, email.html);
    });

    res.status(200).json({ success: true, data: codeFile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ ADMIN APPROVE VERSION ------------------
exports.adminApproveVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const version = await CodeVersion.findById(versionId).populate("codeFile uploadedBy");
    if (!version) return res.status(404).json({ success: false, message: "Version not found" });

    version.reviewStatus = "approved";
    version.reviewedBy = req.admin._id;
    version.approvedAt = new Date();
    await version.save();

    const codeFile = await CodeFile.findById(version.codeFile._id);
    codeFile.status = "approved";
    codeFile.pendingStatus = "none";
    codeFile.verifiedBy = req.admin._id;
    codeFile.lastUpdated = new Date();
    await codeFile.save();

    const email = emailTemplates.approvedNotification(codeFile, version.uploadedBy, req.admin);
    sendEmail(version.uploadedBy.email, email.subject, email.html);

    res.status(200).json({ success: true, data: version });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ ADMIN REJECT VERSION ------------------
exports.adminRejectVersion = async (req, res) => {
  try {
    const { versionId } = req.params;
    const { comments } = req.body;

    const version = await CodeVersion.findById(versionId).populate("codeFile uploadedBy");
    if (!version) return res.status(404).json({ success: false, message: "Version not found" });

    version.reviewStatus = "rejected";
    version.reviewComments = comments || "";
    version.reviewedBy = req.admin._id;
    version.approvedAt = new Date();
    await version.save();

    const codeFile = await CodeFile.findById(version.codeFile._id);
    codeFile.status = "rejected";
    codeFile.pendingStatus = "none";
    codeFile.lastUpdated = new Date();
    await codeFile.save();

    const email = emailTemplates.fileRejected(codeFile, version.uploadedBy, req.admin, comments);
    sendEmail(version.uploadedBy.email, email.subject, email.html);

    res.status(200).json({ success: true, data: version });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ DELETE CODE FILE ------------------
exports.deleteCodeFile = async (req, res) => {
  try {
    const { id } = req.params;
    const codeFile = await CodeFile.findById(id);
    if (!codeFile) return res.status(404).json({ success: false, message: "Code file not found" });

    await CodeVersion.deleteMany({ codeFile: id });
    await codeFile.deleteOne();

    res.status(200).json({ success: true, message: "Code file deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ------------------ GET SUBMITTED CODE FILES (ADMIN) ------------------
exports.getSubmittedCode = async (req, res) => {
  try {
    const codeFiles = await CodeFile.find({ status: "submitted" })
      .populate("owner", "username email")
      .populate("lastUpdatedBy", "username")
      .populate({
        path: "versions",
        populate: { path: "uploadedBy reviewedBy", select: "username email" }
      });

    res.status(200).json({ success: true, data: codeFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
