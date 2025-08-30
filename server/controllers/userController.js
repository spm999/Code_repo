// controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "7d" }
  );
};

// @desc Register user
exports.registerUser = async (req, res) => {
  try {
    console.log("📥 Incoming Register Request:", req.body);

    const { username, email, password, role, department } = req.body;

    console.log("🔍 Checking if user exists with email:", email);
    const userExists = await User.findOne({ email });
    console.log("➡️ User Exists?", !!userExists);

    if (userExists) {
      console.warn("⚠️ Registration failed: User already exists ->", email);
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    console.log("🛠 Creating new user:", { username, email, role, department });
    const user = await User.create({
      username,
      email,
      password,
      role,
      department,
    });

    console.log("✅ User created successfully:", user);

    const token = generateToken(user._id);
    console.log("🔑 Generated Token:", token);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      }
    });
  } catch (err) {
    console.error("❌ Error in registerUser:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};


// @route POST /api/users/login
exports.loginUser = async (req, res) => {
  try {
    console.log("📥 Incoming Login Request:", req.body);

    const { email, password } = req.body;

    console.log("🔍 Looking up user by email:", email);
    const user = await User.findOne({ email }).select("+password");
    console.log("➡️ Found User?", !!user);

    if (!user) {
      console.warn("⚠️ Login failed: User not found ->", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔑 Comparing provided password with stored hash");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("➡️ Password Match?", isMatch);

    if (!isMatch) {
      console.warn("⚠️ Login failed: Invalid password for user ->", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();
    console.log("🕒 Updated last login time:", user.lastLogin);

    const token = generateToken(user);
    console.log("🔑 Generated Token:", token);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("❌ Error in loginUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// @route GET /api/users/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { username, email, role, department, permissions, isActive } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        role,
        department,
        permissions,
        isActive,
        updatedBy: req.user.id,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

