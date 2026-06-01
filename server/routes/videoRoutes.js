const express = require("express");
const { getVideos, addVideo, updateProgress } = require("../controllers/videoController");

const router = express.Router();

// GET all videos
router.get("/", getVideos);

// POST new video
router.post("/", addVideo);
router.put("/:id/progress", updateProgress);

module.exports = router;