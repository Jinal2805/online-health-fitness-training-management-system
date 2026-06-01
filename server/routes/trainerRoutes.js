const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Plan = require("../models/Plan");

const {
  getTrainerDashboard,
  getProgressAnalytics,
} = require("../controllers/trainerController");

const { protect } = require("../middleware/authMiddleware");


// ==============================
// TRAINER DASHBOARD
// ==============================
router.get("/dashboard", protect, getTrainerDashboard);


// ==============================
// TRAINER MEMBERS (FIXED)
// ==============================
router.get("/members", protect, async (req, res) => {
  try {
    const members = await User.find({ role: "member" })
      .populate("assignedPlans");

    res.json({
      success: true,
      members: members.map((member) => ({
        _id: member._id,

        userId: member._id,

        name: member.name || "Member",

        goal: member.goal,

        progress: member.progress || 0,

        // ✅ IMPORTANT FIX
        progressData: member.progressData || [],

        activePlan:
          member.assignedPlans?.length > 0
            ? member.assignedPlans[0].title
            : "No Plan",
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching members",
      error: error.message,
    });
  }
});


// ==============================
// PROGRESS ANALYTICS
// ==============================
router.get("/progress-analytics", protect, getProgressAnalytics);


// ==============================
// GET ALL APPROVED TRAINERS
// ==============================
router.get("/", async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      isApproved: true,
    }).select("-password");

    res.json(trainers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching trainers",
    });
  }
});


// ==============================
// ASSIGN PLAN TO MEMBER
// ==============================
router.put("/assign-plan/:memberId/:planId", protect, async (req, res) => {
  try {
    const { memberId, planId } = req.params;

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // init arrays
    if (!member.assignedPlans) member.assignedPlans = [];
    if (!plan.assignedMembers) plan.assignedMembers = [];

    // avoid duplicates
    if (!member.assignedPlans.includes(planId)) {
      member.assignedPlans.push(planId);
    }

    if (!plan.assignedMembers.includes(memberId)) {
      plan.assignedMembers.push(memberId);
    }

    member.activePlan = plan.name;
    member.activePlanId = plan._id;

    await member.save();
    await plan.save();

    res.json({
      success: true,
      message: "Plan assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ==============================
// UPDATE MEMBER PROGRESS (FIXED)
// ==============================
router.put("/update-progress/:id", protect, async (req, res) => {
  try {
    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // current progress
    member.progress = req.body.progress;

    // =========================
    // ✅ ADD PROGRESS HISTORY
    // =========================
    if (!member.progressData) {
      member.progressData = [];
    }

    member.progressData.push({
      date: new Date().toLocaleDateString(),
      progress: req.body.progress,
    });

    await member.save();

    res.json({
      success: true,
      member,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;