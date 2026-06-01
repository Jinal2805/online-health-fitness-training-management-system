const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  getMembers,
    testNotification
} = require("../controllers/userController");

// ✅ MEMBER: GET APPROVED TRAINERS
router.get("/trainers", protect, async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      isApproved: true,
      isBlocked: false
    }).sort({ name: 1 }); // ✅ ADD THIS LINE

    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trainers" });
  }
});

// ================= PROFILE =================

// GET PROFILE
router.get("/profile", protect, getProfile);

// UPDATE PROFILE
router.put("/profile", protect, updateProfile);

// CHANGE PASSWORD
router.put("/change-password", protect, changePassword);
router.get("/members", getMembers);
router.get("/test-notification", protect, testNotification);


module.exports = router;