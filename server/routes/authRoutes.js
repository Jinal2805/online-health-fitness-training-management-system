const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const { registerUser, loginUser, forgotPassword,  resetPassword } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Register route
router.post("/register", upload.single("certificate"), registerUser);

// Login route
router.post("/login", loginUser);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Reset password route
router.post("/reset-password/:token", resetPassword);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
});


module.exports = router;