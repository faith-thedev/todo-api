// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(
    "FATAL ERROR: JWT_SECRET is not defined in environment variables."
  );
  process.exit(1); // Exit if no JWT secret is defined
}

const authenticate = async (req, res, next) => {
  try {
    // Check for token in multiple locations (header, cookie)
    let token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      // Different response for API vs web requests
      if (req.path.startsWith("/api")) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }
      req.flash("error", "Please login to access this page");
      return res.redirect("/login");
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      if (req.path.startsWith("/api")) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed - user not found",
        });
      }
      req.flash("error", "Authentication failed");
      return res.redirect("/login");
    }

    // Attach user to request
    req.user = user;
    res.locals.currentUser = user; // Make user available in EJS templates

    // For API requests, you might want to refresh the token
    if (req.path.startsWith("/api")) {
      const newToken = generateToken(user._id);
      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    // Handle different JWT errors specifically
    if (error.name === "TokenExpiredError") {
      if (req.path.startsWith("/api")) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again",
        });
      }
      req.flash("error", "Session expired. Please login again");
      return res.redirect("/login");
    }

    if (error.name === "JsonWebTokenError") {
      if (req.path.startsWith("/api")) {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      req.flash("error", "Invalid session. Please login again");
      return res.redirect("/login");
    }

    // Generic error response
    if (req.path.startsWith("/api")) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
    req.flash("error", "Authentication failed");
    res.redirect("/auth/login");
  }
};

// Helper function to generate tokens
const generateToken = (id) => {
  return jwt.sign({id}, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Middleware to ensure authenticated (for web routes)
const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please login to access this page");
    return res.redirect("/auth/login");
  }
  next();
};

// Middleware to ensure guest (for login/register pages)
const ensureGuest = (req, res, next) => {
  if (req.user) {
    return res.redirect("/todos");
  }
  next();
};

module.exports = {
  authenticate,
  ensureAuthenticated,
  ensureGuest,
  generateToken,
};
