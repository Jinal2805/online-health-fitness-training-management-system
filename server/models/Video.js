const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  difficulty: String,
  url: { type: String, required: true },
  trainer: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  watchProgress: {
  type: Number,
  default: 0
}
});

module.exports = mongoose.model("Video", videoSchema);