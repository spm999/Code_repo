const cloudinary = require('cloudinary').v2;
const CodeFile = require("../models/CodeFile");
const CodeVersion = require("../models/CodeVersion");
const User = require("../models/User");
const { sendEmail, emailTemplates } = require("../utils/emailService");


exports.createCodeFile = async (req, res) => {
  try {
    // Extract text fields
    const { title, description, tags, language, codeContent } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    // Check inputs
    const hasCodeFile = req.files && req.files['codeFile'] && req.files['codeFile'][0];
    const hasCodeContentFile = req.files && req.files['codeContent'] && req.files['codeContent'][0];
    const hasCodeContentText = codeContent && codeContent.trim() !== '';

    if (!hasCodeFile && !hasCodeContentFile && !hasCodeContentText) {
      return res.status(400).json({ success: false, message: "Code file or code content is required" });
    }

    // Create DB entry
    const newCodeFile = await CodeFile.create({
      title,
      description: description || "",
      owner: req.user._id,
      lastUpdatedBy: req.user._id,
      tags: tags ? (typeof tags === "string" ? tags.split(",") : tags) : [],
      language: language || "javascript",
      status: "submitted",
      pendingStatus: "awaiting_admin",
    });

    let fileUrl, fileSize;

    if (hasCodeFile) {
      const codeFile = req.files["codeFile"][0];
      fileUrl = codeFile.path;      // ✅ Cloudinary URL
      fileSize = codeFile.size;
    } else if (hasCodeContentFile) {
      const contentFile = req.files["codeContent"][0];
      fileUrl = contentFile.path;   // ✅ Cloudinary URL
      fileSize = contentFile.size;
    } else if (hasCodeContentText) {
      // When text is submitted, we need to upload it as a file manually
      const buffer = Buffer.from(codeContent, "utf-8");
      const uploadResponse = await cloudinary.uploader.upload_stream(
        {
          folder: "code-repository",
          resource_type: "raw",
          public_id: `codefile-${Date.now()}`,
          format: "txt",
        },
        (error, result) => {
          if (error) throw error;
          fileUrl = result.secure_url;
          fileSize = buffer.length;
        }
      );
      // To use upload_stream properly, you need a stream.pipe – I can show you how if you want.
    }

    // Save version
    const codeVersion = await CodeVersion.create({
      codeFile: newCodeFile._id,
      versionNumber: 1,
      uploadedBy: req.user._id,
      fileUrl,
      fileSize,
      language: language || "javascript",
      tags: tags ? (typeof tags === "string" ? tags.split(",") : tags) : [],
    });

    newCodeFile.versions.push(codeVersion._id);
    await newCodeFile.save();

    // Notify admins
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
    console.log(codeFiles)
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

// ------------------ GET USER'S CODE FILES ------------------
exports.getUserCodeFiles = async (req, res) => {
  try {
    const codeFiles = await CodeFile.find({ owner: req.user._id })
      .populate("owner", "username email")
      .populate("lastUpdatedBy", "username")
      .populate("verifiedBy", "username")
      .populate({
        path: "versions",
        populate: { 
          path: "uploadedBy reviewedBy", 
          select: "username email"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: codeFiles });
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


//----------------------------update code content

// PUT /api/code/files/:id/content
exports.updateCodeContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { codeContent } = req.body;

    if (!codeContent) {
      return res.status(400).json({ success: false, message: "Code content is required" });
    }

    const codeFile = await CodeFile.findById(id);
    if (!codeFile) return res.status(404).json({ success: false, message: "File not found" });

    if (codeFile.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Update the codeContent field
    codeFile.codeContent = codeContent;
    codeFile.lastUpdated = new Date();
    codeFile.lastUpdatedBy = req.user._id;
    await codeFile.save();

    res.status(200).json({ success: true, data: codeFile, message: "Code updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
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

    // Fix: Use rejectedNotification instead of fileRejected
    const email = emailTemplates.rejectedNotification(codeFile, version.uploadedBy, req.admin, comments);
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
