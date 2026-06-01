const Member = require("../models/Member");
const User = require("../models/User");
const mongoose = require("mongoose");



exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user._id;

    // ✅ Total members assigned to this trainer
    const totalMembers = await User.countDocuments({
      role: "member",
      trainer: trainerId,
    });

    // ✅ Active clients
    const activeClients = await User.countDocuments({
      role: "member",
      trainer: trainerId,
      isActive: true,
    });

    // ✅ TEMP STATIC DATA (you can make dynamic later)
    const schedule = [
      { name: "Jinal", time: "5:00 PM" },
      { name: "Reni", time: "6:30 PM" },
    ];

    const activePlans = [
      { name: "Fat Loss Plan" },
      { name: "Muscle Gain Plan" },
    ];

    const pendingPlansList = [
      { name: "Yoga Plan" },
      { name: "Cardio Plan" },
    ];

    res.json({
      totalMembers,
      activeClients,
      sessionsToday: schedule.length,
      pendingPlans: pendingPlansList.length,
      schedule,
      activePlans,
      pendingPlansList,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

exports.getProgressAnalytics = async (req, res) => {

  try {

    const trainerId = req.user._id;

    const members = await User.find({
      role: "member",
      trainer: trainerId,
    });

    const totalMembers = members.length;

    const activeMembers = members.filter(
      m => (m.progress || 0) > 0
    ).length;

    const avgProgress =
      members.reduce(
        (acc, m) => acc + (m.progress || 0),
        0
      ) / (members.length || 1);

    const bestMembers =
      [...members]
        .sort(
          (a, b) =>
            (b.progress || 0) - (a.progress || 0)
        )
        .slice(0, 3);

    const goalStats = {};

    members.forEach((m) => {

      const goal = m.goal || "Other";

      if (!goalStats[goal]) {
        goalStats[goal] = 0;
      }

      goalStats[goal]++;

    });

    res.json({
      totalMembers,
      activeMembers,
      avgProgress,
      bestMembers,
      goalStats,
      members,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// ✅ GET TRAINER MEMBERS
exports.getTrainerMembers = async (req, res) => {
  try {

    const trainerId = req.user._id;

    const members = await User.find({
      role: "member",
      trainer: trainerId,
    }).select("-password");

    res.status(200).json(members);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching members"
    });
  }
};