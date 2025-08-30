// models/AdminUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin"], // Only one role now
      default: "admin",
    },

    // ✅ Permissions specific to admins
    permissions: {
      canCreateUsers: { type: Boolean, default: true },
      canManageUsers: { type: Boolean, default: true },
      canAssignRoles: { type: Boolean, default: true },
      canApproveCode: { type: Boolean, default: true },
      canManageRepositories: { type: Boolean, default: true },
      canAccessAuditLogs: { type: Boolean, default: true },
      canManageSystemSettings: { type: Boolean, default: true }, // All admins can manage settings now
      canRunBackups: { type: Boolean, default: true },
      canWhitelistIPs: { type: Boolean, default: true },
    },

    // ✅ Security-related
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    allowedIPs: [
      {
        type: String, // e.g. "192.168.1.100"
      },
    ],

    // ✅ Profile & activity
    profilePicture: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "Administration",
    },
    managedDepartments: [
      {
        type: String, // e.g., "IT", "Cybersecurity"
      },
    ],

    // ✅ Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before save
adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
adminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Account lock check (after too many failed logins)
adminUserSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("AdminUser", adminUserSchema);