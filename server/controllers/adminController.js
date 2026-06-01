const User = require("../models/User");
const Trainer = require("../models/Trainer");


// ================= USERS =================

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const users = await User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: { $ne: "admin" } });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      totalUsers: total 
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BLOCK / UNBLOCK USER
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= TRAINER MANAGEMENT =================

// GET TRAINERS
exports.getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }); // ✅ IMPORTANT FIX
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// APPROVE TRAINER
exports.approveTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    user.status = "active";

    await user.save();

    res.json({ message: "Trainer Approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// REJECT TRAINER
exports.rejectTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.status = "rejected";
    await user.save();

    res.json({ message: "Trainer Rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY TRAINER
exports.verifyTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isVerified = !user.isVerified;
    await user.save();

    res.json({ message: "Verification updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// BLOCK TRAINER
exports.blockTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "Block status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE TRAINER
exports.deleteTrainer = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // ✅ FIXED
    res.json({ message: "Trainer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};