const express = require("express");
const Member = require("../models/Member");
const User = require("../models/User");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// ✅ GET MEMBER BY USER ID
router.get("/user/:id", async (req, res) => {
  try {

    const member = await Member.findOne({
      userId: req.params.id,
    }).populate("assignedPlans");

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ ADD PROGRESS
router.put("/progress/:id", async (req, res) => {
  try {

    const { progress } = req.body;

    const member = await Member.findOne({
      userId: req.params.id,
    });

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // ✅ SAVE CURRENT PROGRESS
    member.progress = progress;

    // ✅ SAVE HISTORY
    member.progressData.push({
      date: new Date()
        .toISOString()
        .split("T")[0],

      progress,

      goal: member.goal,
    });

    await member.save();

    res.json({
      success: true,
      progress: member.progress,
      member,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ UPDATE MEMBER PROFILE / GOAL
router.put("/:id", async (req, res) => {
  try {

    const member = await Member.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.json(member);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put(
  "/update-my-progress",
  protect,
  async (req, res) => {

    try {

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.progress = req.body.progress;
      user.weight = req.body.weight;
      user.completedWorkouts =
        req.body.completedWorkouts;

      await user.save();

      res.json({
        success: true,
        user,
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);

module.exports = router;