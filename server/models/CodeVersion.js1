// models/CodeVersion.js
const mongoose = require("mongoose");

const codeVersionSchema = new mongoose.Schema(
  {
    codeFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodeFile",
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changeLog: {
      type: String,
      default: "",
    },
    // Multi-level version status
    status: {
      type: String,
      enum: ["draft", "pending_reviewer", "pending_admin", "approved", "rejected", "archived"],
      default: "draft",
    },
    // Is this the active version?
    isActive: {
      type: Boolean,
      default: false,
    },
    // AI Analysis reference
    aiAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAnalysis",
      default: null,
    },
    // Review history
    reviews: [{
      reviewer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
      },
      comment: String,
      status: {
        type: String,
        enum: ["pending", "approved", "changes_requested", "rejected"],
        default: "pending",
      },
      reviewType: {
        type: String,
        enum: ["technical", "security", "functional", "general"],
        default: "general",
      },
      createdAt: { 
        type: Date, 
        default: Date.now,
      },
    }],
    // Suggested changes
    suggestedChanges: [{
      suggestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      changes: String,
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CodeVersion", codeVersionSchema);





