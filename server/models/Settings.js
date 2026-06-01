const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  platformName: String,
  email: String,
  phone: String,
  darkMode: Boolean,
  notifications: Boolean,
  twoFA: Boolean,
});

module.exports = mongoose.model("Settings", settingsSchema);