const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");

// ✅ GET all workouts for user
router.get("/:userId", async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADD workout
router.post("/", async (req, res) => {
  try {
    const { userId, name, duration } = req.body;

    const workout = await Workout.create({
      userId,
      name,
      duration,
    });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ COMPLETE workout
const Member = require("../models/Member");

router.put("/complete/:id", async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // ✅ mark complete
    workout.completed = true;
    await workout.save();

    // 🔥 update member stats
    const member = await Member.findOne({ userId: workout.userId });

    if (member) {
      member.workoutsCompleted += 1;
      member.caloriesBurned += 200; // you can adjust
      await member.save();
    }

    res.json({ message: "Workout completed + stats updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;