const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Workout", "Diet"],
      default: "Workout",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    calories: {
      type: Number,
      default: 0,
    },

    protein: {
      type: Number,
      default: 0,
    },

    carbs: {
      type: Number,
      default: 0,
    },

    fats: {
      type: Number,
      default: 0,
    },

    weeklySchedule: {
      type: String,
      default: "",
    },

    template: {
      type: Boolean,
      default: false,
    },

    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Plan",
  planSchema
);