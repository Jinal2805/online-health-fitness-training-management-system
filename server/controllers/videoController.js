const Video = require("../models/Video");

// ✅ GET VIDEOS
const getVideos = async (req, res) => {
    try {
        const { search, category, difficulty } = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (category && category !== "All") {
            filter.category = category;
        }

        if (difficulty && difficulty !== "All") {
            filter.difficulty = difficulty;
        }

        const videos = await Video.find(filter);
        res.json(videos);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ ADD VIDEO
const addVideo = async (req, res) => {
    try {
        const { title, category, difficulty, url, trainer } = req.body;

        const video = new Video({
            title,
            category,
            difficulty,
            url,
            trainer
        });

        const savedVideo = await video.save();
        res.status(201).json(savedVideo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;

        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { watchProgress: progress },
            { new: true }
        );

        res.json(video);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getVideos, addVideo, updateProgress };