// const express = require("express");
// const router = express.Router();
// const {
//   registerAdmin,
//   loginAdmin,
//   getAllAdmins,
//   updateAdmin,
//   deleteAdmin,
//   deleteUser, 
//   getAllUsers
// } = require("../controllers/adminController");

// const { protectAdmin, admin } = require("../middlewares/authMiddleware");

// // Public routes
// router.post("/register", registerAdmin);
// router.post("/login", loginAdmin);

// // Protected routes - only for authenticated admin users
// router.get("/", protectAdmin, admin, getAllAdmins);
// router.put("/:id", protectAdmin, admin, updateAdmin);
// router.delete("/:id", protectAdmin, admin, deleteAdmin);

// router.get("/", protectAdmin, admin, getAllUsers);   
// router.delete("/:id", protectAdmin, admin, deleteUser);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  deleteUser
} = require("../controllers/adminController");

const { protectAdmin, admin } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes - only for authenticated admin users
router.get("/", protectAdmin, admin, getAllAdmins);
router.put("/:id", protectAdmin, admin, updateAdmin);
router.delete("/:id", protectAdmin, admin, deleteAdmin);

// User management routes (if you want them under /api/admins)
router.get("/users", protectAdmin, admin, getAllUsers);   
router.delete("/users/:id", protectAdmin, admin, deleteUser);

module.exports = router;