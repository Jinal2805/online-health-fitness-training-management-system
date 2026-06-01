const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

// GET ALL
router.get("/", protect, getNotifications);

// MARK READ
router.put("/:id", protect, markAsRead);

module.exports = router;