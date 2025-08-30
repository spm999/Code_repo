const mongoose = require("mongoose");

const codeFileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // collaborators: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // ],
  versions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CodeVersion",
    },
  ],
  sharedLink: String,
  status: {
    type: String,
    enum: [ "submitted", "approved", "rejected"],
  },
  pendingStatus: {
    type: String,
    enum: ["none", "awaiting_admin"],
    default: "none",
  },
  tags: [String],           // e.g., ["backend", "javascript", "API"]
  language: {               // Programming language of the code file
    type: String,
    default: "javascript",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
});

module.exports = mongoose.model("CodeFile", codeFileSchema);
