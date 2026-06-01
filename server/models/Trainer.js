const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
  name: String,
  email: String,
  specialization: String,
  experience: String,
  bio: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  certificate: {
    type: String, // store file URL later
  },

}, { timestamps: true });

module.exports = mongoose.model("Trainer", trainerSchema);