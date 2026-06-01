const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "trainer", "member"],
    default: "member"
  },

  profileImage: {
    type: String,
    default: ""
  },

  price: {
    type: Number,
    default: 500
  },

  rating: {
    type: Number,
    default: 4.5
  }, // ✅ FIXED

  // ================= MEMBER FIELDS =================
  age: Number,
  height: Number,
  weight: Number,
  gender: String,
  goal: String,
  activity: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // ================= TRAINER FIELDS =================
  phone: String,
  experience: String,
  specialization: String,
  location: String,
  bio: String,
  certificate: String,

  // ================= ADMIN CONTROL =================
  isApproved: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "inactive"],
    default: "pending"
  },

  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  progress: {
    type: Number,
    default: 0,
  },

  progressData: [
    {
      date: String,
      progress: Number,
      goal: String,
    },
  ],

  goal: {
    type: String,
    default: "Fitness",
  },

  assignedPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
  ],

  activePlan: {
    type: String,
    default: "",
  },

  progress: {
    type: Number,
    default: 0,
  },

  goal: {
    type: String,
    default: "Fitness",
  },

  weight: {
    type: Number,
    default: 0,
  },

  completedWorkouts: {
    type: Number,
    default: 0,
  },

  assignedPlans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
  ],

  activePlan: {
    type: String,
    default: "",
  },

  activePlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);