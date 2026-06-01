const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Notification = require("../models/Notification");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, weight, height, goal, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.weight = weight || user.weight;
    user.height = height || user.height;
    user.goal = goal || user.goal;
    user.profileImage = profileImage || user.profileImage;

    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.json(updatedUser);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// GET ALL MEMBERS
exports.getMembers = async (req, res) => {

    try {

        const members = await User.find({
            role: "member"
        }).select("_id name email");

        res.json(members);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating password" });
  }
};

exports.testNotification = async (req, res) => {
  try {
    const Notification = require("../models/Notification");
    const io = req.app.get("io");

    const notification = await Notification.create({
      user: req.user._id,
      title: "Test Notification",
      message: "Real-time working 🔥",
      type: "alert",
      important: true
    });

    io.to(req.user._id.toString()).emit("newNotification", notification);

    res.json(notification);

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};