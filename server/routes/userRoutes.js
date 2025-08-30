const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateUser,
} = require("../controllers/userController");
const { protectUser } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/me", protectUser, getProfile);          // ✅ Updated function name
router.put("/:id", protectUser, updateUser);


module.exports = router;