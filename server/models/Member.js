const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: String,
    email: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workoutsCompleted: {
      type: Number,
      default: 0,
    },

    caloriesBurned: {
      type: Number,
      default: 0,
    },

    activePlan: {
      type: String,
      default: "Not Assigned",
    },

    // ✅ NEW
    assignedPlans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
    ],

    trainerName: {
      type: String,
      default: "Not Assigned",
    },

    todayWorkout: {
      title: String,
      duration: String,
    },

    progressData: [
      {
        date: String,
        progress: Number,
        goal: String,
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },

    goal: {
      type: String,
      default: "Weight Loss",
    },

    height: {
      type: Number,
      default: 170,
    },

    weightData: [
      {
        day: String,
        weight: Number,
      },
    ],


    progress: {
      type: Number,
      default: 0,
    },

    attendance: {
      type: Number,
      default: 0,
    },

    weightLoss: {
      type: Number,
      default: 0,
    },

    completedWorkouts: {
      type: Number,
      default: 0,
    },

    goal: {
      type: String,
      default: "Fitness",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);