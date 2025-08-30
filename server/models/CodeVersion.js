const mongoose = require("mongoose");

const codeVersionSchema = new mongoose.Schema({
  codeFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodeFile",
    required: true,
  },
  versionNumber: {
    type: Number,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String, // URL of code file stored in cloud (Cloudinary, S3, etc.)
    required: true,
  },
  fileSize: Number, // in bytes
  language: {
    type: String,
    default: "javascript",
  },
  tags: [String], // optional tags specific to this version
  reviewStatus: {
    type: String,
    enum: ["pending", "approved", "changes_requested", "rejected"],
    default: "pending",
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviewComments: String,
  approvedAt: Date,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model("CodeVersion", codeVersionSchema);
