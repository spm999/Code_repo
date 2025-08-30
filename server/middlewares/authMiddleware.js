// // // middleware/authMiddleware.js
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // exports.protect = async (req, res, next) => {
// //   let token;
// //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
// //     try {
// //       token = req.headers.authorization.split(" ")[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
// //       req.user = await User.findById(decoded.id).select("-password");
// //       next();
// //     } catch (err) {
// //       return res.status(401).json({ message: "Not authorized, token failed" });
// //     }
// //   }
// //   if (!token) {
// //     return res.status(401).json({ message: "Not authorized, no token" });
// //   }
// // };

// // exports.admin = (req, res, next) => {
// //   if (req.user && req.user.role === "admin") {
// //     next();
// //   } else {
// //     res.status(403).json({ message: "Admin access only" });
// //   }
// // };



// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// // exports.protect = async (req, res, next) => {
// //   let token;
// //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
// //     try {
// //       token = req.headers.authorization.split(" ")[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
// //       req.user = await User.findById(decoded.id).select("-password");
// //       next();
// //     } catch (err) {
// //       return res.status(401).json({ message: "Not authorized, token failed" });
// //     }
// //   }
// //   if (!token) {
// //     return res.status(401).json({ message: "Not authorized, no token" });
// //   }
// // };

// exports.protect = async (req, res, next) => {
//   try {
//     let token;
    
//     // Check for token in Authorization header
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }
    
//     // Check for token in cookies (if using cookies)
//     else if (req.cookies && req.cookies.token) {
//       token = req.cookies.token;
//     }

//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Not authorized, no token provided" 
//       });
//     }

//     try {
//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      
//       // Get user from token
//       req.user = await User.findById(decoded.id).select("-password");
      
//       if (!req.user) {
//         return res.status(401).json({ 
//           success: false,
//           message: "Not authorized, user not found" 
//         });
//       }

//       // Check if user is active
//       if (!req.user.isActive) {
//         return res.status(401).json({ 
//           success: false,
//           message: "Not authorized, account is deactivated" 
//         });
//       }

//       next();
//     } catch (jwtError) {
//       console.error('JWT verification error:', jwtError);
//       return res.status(401).json({ 
//         success: false,
//         message: "Not authorized, token invalid or expired" 
//       });
//     }
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Authentication error" 
//     });
//   }
// };

// exports.admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin access only" });
//   }
// };

// exports.reviewer = (req, res, next) => {
//   if (req.user && req.user.role === "reviewer") {
//     next();
//   } else {
//     res.status(403).json({ message: "Reviewer access only" });
//   }
// };

// exports.superadmin = (req, res, next) => {
//   if (req.user && req.user.role === "superadmin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Superadmin access only" });
//   }
// };


// exports.adminOrSuper = (req, res, next) => {
//   console.log('User role from database:', req.user?.role);
//   console.log('Role comparison results:');
//   console.log('Is admin:', req.user?.role === "admin");
//   console.log('Is superadmin:', req.user?.role === "superadmin");
  
//   if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
//     next();
//   } else {
//     res.status(403).json({ message: "Admin or Superadmin access only" });
//   }
// };



// // Combined middleware for multiple roles
// exports.requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Not authorized" });
//     }
    
//     if (Array.isArray(roles)) {
//       if (roles.includes(req.user.role)) {
//         next();
//       } else {
//         res.status(403).json({ message: `Access denied. Required roles: ${roles.join(', ')}` });
//       }
//     } else {
//       if (req.user.role === roles) {
//         next();
//       } else {
//         res.status(403).json({ message: `Access denied. Required role: ${roles}` });
//       }
//     }
//   };
// };

// // Middleware to check if user owns the resource or is admin
// exports.ownerOrAdmin = (resourceUserId) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Not authorized" });
//     }
    
//     if (req.user.role === "admin" || req.user._id.toString() === resourceUserId.toString()) {
//       next();
//     } else {
//       res.status(403).json({ message: "Access denied. You must be the owner or an admin" });
//     }
//   };
// };

// // Middleware for file access (owner, collaborator, or public)
// exports.fileAccess = async (req, res, next) => {
//   try {
//     const codeFile = await CodeFile.findById(req.params.id);
    
//     if (!codeFile) {
//       return res.status(404).json({ message: "Code file not found" });
//     }
    
//     // Admin can access everything
//     if (req.user.role === "admin") {
//       return next();
//     }
    
//     // Owner can access
//     if (codeFile.createdBy.toString() === req.user._id.toString()) {
//       return next();
//     }
    
//     // Collaborator can access
//     const isCollaborator = codeFile.collaborators.some(
//       collab => collab.user.toString() === req.user._id.toString()
//     );
    
//     if (isCollaborator) {
//       return next();
//     }
    
//     // Public files can be accessed by anyone
//     if (codeFile.isPublic) {
//       return next();
//     }
    
//     res.status(403).json({ message: "Access denied to this file" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/Admin"); // Make sure this path is correct
const User = require("../models/User"); // For regular users

// Protect route for Admin Users
exports.protectAdmin = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    // Check for token in cookies (if using cookies)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, no token provided" 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      
      // Get admin user from token
      req.admin = await AdminUser.findById(decoded.id).select("-password");
      
      if (!req.admin) {
        return res.status(401).json({ 
          success: false,
          message: "Not authorized, admin user not found" 
        });
      }

      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token invalid or expired" 
      });
    }
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Authentication error" 
    });
  }
};

// Protect route for Regular Users
exports.protectUser = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    // Check for token in cookies (if using cookies)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, no token provided" 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
      
      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: "Not authorized, user not found" 
        });
      }

      // Check if user is active
      if (!req.user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: "Not authorized, account is deactivated" 
        });
      }

      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: "Not authorized, token invalid or expired" 
      });
    }
  } catch (error) {
    console.error('User auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Authentication error" 
    });
  }
};

// Admin role check (for admin routes)
exports.admin = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};


// Combined authentication middleware for both users and admins
exports.protectBoth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    // Try to find regular user
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      req.role = "user";
      return next();
    }

    // Try to find admin
    const admin = await AdminUser.findById(decoded.id).select("-password");
    if (admin) {
      req.admin = admin;
      req.role = "admin";
      return next();
    }

    return res.status(401).json({ message: "Not authorized, user/admin not found" });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};



// Combined middleware for multiple roles (for regular users)
exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    if (Array.isArray(roles)) {
      if (roles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ message: `Access denied. Required roles: ${roles.join(', ')}` });
      }
    } else {
      if (req.user.role === roles) {
        next();
      } else {
        res.status(403).json({ message: `Access denied. Required role: ${roles}` });
      }
    }
  };
};

// Middleware to check if user owns the resource or is admin
exports.ownerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    if (req.user.role === "admin" || req.user._id.toString() === resourceUserId.toString()) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. You must be the owner or an admin" });
    }
  };
};

// Middleware for file access (owner, collaborator, or public)
exports.fileAccess = async (req, res, next) => {
  try {
    const codeFile = await CodeFile.findById(req.params.id);
    
    if (!codeFile) {
      return res.status(404).json({ message: "Code file not found" });
    }
    
    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }
    
    // Owner can access
    if (codeFile.createdBy.toString() === req.user._id.toString()) {
      return next();
    }
    
    // Collaborator can access
    const isCollaborator = codeFile.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString()
    );
    
    if (isCollaborator) {
      return next();
    }
    
    // Public files can be accessed by anyone
    if (codeFile.isPublic) {
      return next();
    }
    
    res.status(403).json({ message: "Access denied to this file" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};