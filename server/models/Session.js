const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // NEW FIELDS
    title: {
      type: String,
      default: "Fitness Session",
    },

    goal: {
      type: String,
      default: "General Fitness",
    },

    sessionType: {
      type: String,
      default: "Live Video Call",
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    roomId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled"
    },

    attendance: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);