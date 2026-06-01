const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const Settings = require("../models/Settings");
const { getUsers } = require("../controllers/adminController");

// Get all trainers (pending approval)
router.get("/trainers", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer", isApproved: false });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trainers" });
  }
});

// Approve trainer
router.put("/approve/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    trainer.isApproved = true;
    trainer.status = "approved";
    await trainer.save();

    res.json({ message: "Trainer approved successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error approving trainer" });
  }
});


router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
 getUsers
  
);

router.delete(
  "/user/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  }
);

// ================= TRAINER MANAGEMENT =================

// GET ALL TRAINERS (not only pending)
router.get(
  "/all-trainers",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const trainers = await User.find({ role: "trainer" });
    res.json(trainers);
  }
);

// REJECT TRAINER
router.put(
  "/reject/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const trainer = await User.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    trainer.isApproved = false;
    trainer.status = "rejected"; // optional field
    await trainer.save();

    res.json({ message: "Trainer rejected" });
  }
);

// UNDO REJECT (Make trainer pending again)
router.put(
  "/undo-reject/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const trainer = await User.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    trainer.status = "pending";
    trainer.isApproved = false;

    await trainer.save();

    res.json({ message: "Trainer moved back to pending" });
  }
);

// VERIFY TRAINER
router.put(
  "/verify/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const trainer = await User.findById(req.params.id);

    trainer.isVerified = !trainer.isVerified;
    await trainer.save();

    res.json({ message: "Trainer verification updated" });
  }
);

// BLOCK / UNBLOCK TRAINER
router.put(
  "/block-trainer/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const trainer = await User.findById(req.params.id);

    trainer.isBlocked = !trainer.isBlocked;
    await trainer.save();

    res.json({ message: "Trainer block status updated" });
  }
);

// DELETE TRAINER
router.delete(
  "/trainer/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Trainer deleted" });
  }
);


// BLOCK / UNBLOCK USER
router.put(
  "/user/block/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User block status updated" });
  }
);

// GET ANALYTICS DATA
router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments({ role: "member" });
      const totalTrainers = await User.countDocuments({ role: "trainer" });
      const activeTrainers = await User.countDocuments({
        role: "trainer",
        isApproved: true
      });

      // Dummy revenue (you can improve later)
      const revenue = 125000;

      res.json({
        totalUsers,
        totalTrainers,
        activeTrainers,
        revenue
      });

    } catch (err) {
      res.status(500).json({ message: "Error fetching analytics" });
    }
  }
);

router.get(
  "/user-growth",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find({ role: "member" });

      // group by date (simple version)
      const growth = {};

      users.forEach((user) => {
        const date = user.createdAt.toISOString().split("T")[0];

        if (!growth[date]) {
          growth[date] = 0;
        }

        growth[date]++;
      });

      const result = Object.keys(growth).map((date) => ({
        month: date,
        users: growth[date]
      }));

      res.json(result);

    } catch (err) {
      res.status(500).json({ message: "Error fetching growth" });
    }
  }
);

// GET SETTINGS
router.get("/settings", protect, authorizeRoles("admin"), async (req, res) => {
  const settings = await Settings.findOne();
  res.json(settings);
});

// UPDATE SETTINGS
router.put("/settings", protect, authorizeRoles("admin"), async (req, res) => {
  const updated = await Settings.findOneAndUpdate({}, req.body, { new: true });
  res.json(updated);
});

// RESET SYSTEM
router.delete("/reset", protect, authorizeRoles("admin"), async (req, res) => {
  await Settings.deleteMany();
  res.json({ message: "System reset" });
});

// CLEAR DATA
router.delete("/clear", protect, authorizeRoles("admin"), async (req, res) => {
  await User.deleteMany();
  res.json({ message: "All data cleared" });
});

// UPDATE SETTINGS
router.put(
  "/settings",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      let settings = await Settings.findOne();

      if (!settings) {
        settings = new Settings(req.body);
      } else {
        Object.assign(settings, req.body);
      }

      await settings.save();

      res.json({ message: "Settings updated successfully", settings });

    } catch (error) {
      res.status(500).json({ message: "Error updating settings" });
    }
  }
);

//States
router.get("/dashboard-stats", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "member" });
    const totalTrainers = await User.countDocuments({ role: "trainer" });

    const activePlans = await User.countDocuments({ planActive: true });

    // Dummy revenue (replace later with payments collection)
    const revenue = totalUsers * 1000;

    res.json({
      totalUsers,
      totalTrainers,
      activePlans,
      revenue,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

//usergrowth Api
router.get("/user-growth", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();

    const growth = {};

    users.forEach((user) => {
      const date = new Date(user.createdAt).toLocaleDateString();

      growth[date] = (growth[date] || 0) + 1;
    });

    const result = Object.keys(growth).map((date) => ({
      month: date,
      users: growth[date],
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "Error fetching growth" });
  }
});

//Trainer Distribution API
router.get("/trainer-distribution", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" });

    const types = {};

    trainers.forEach((t) => {
      const spec = t.specialization || "Other";
      types[spec] = (types[spec] || 0) + 1;
    });

    const result = Object.keys(types).map((key) => ({
      type: key,
      count: types[key],
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "Error fetching distribution" });
  }
});

//InActive 
router.put(
  "/user/toggle-active/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Toggle Active / Inactive
      if (user.status === "inactive") {
        user.status = "approved"; // Active
      } else {
        user.status = "inactive"; // Inactive
      }

      await user.save();

      res.json({ message: "User status updated", user });

    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/user/update/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Allowed fields only
      const allowedFields = [
        "name",
        "phone",
        "bio",
        "age",
        "height",
        "weight",
        "goal",
        "activity",
        "experience",
        "specialization",
        "location"
      ];

      // ✅ Update only allowed fields
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      await user.save();

      res.json({
        message: "User updated successfully",
        user
      });

    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }
);


module.exports = router;