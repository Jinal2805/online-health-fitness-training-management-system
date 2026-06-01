const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

exports.registerUser = async (req, res) => {
  try {
    console.log("FILE:", req.file); // 👈 debug

    const {
      name,
      email,
      password,
      phone,
      gender,
      experience,
      specialization,
      location,
      bio,
      role
    } = req.body;

    const certificate = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.create({
      name,
      email,
      password,
      phone,
      gender,
      experience,
      specialization,
      location,
      bio,
      role: role || "member",
      certificate
    });


     if (role === "member") {

  // 🔥 find approved trainer
  const trainer = await User.findOne({
    role: "trainer",
    isApproved: true
  });

  if (!trainer) {
    return res.status(400).json({
      message: "No approved trainer available"
    });
  }

  // ✅ assign trainer to member
  user.trainer = trainer._id;
  await user.save();

  // optional member collection
  await Member.create({
    userId: user._id,
    name: user.name,
    email: user.email
  });
}

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message
    });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    console.log("Login Request:", req.body); // DEBUG

    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "User not found" });
    }
    // ✅ Role check AFTER user exists
    if (role && user.role !== role) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    console.log("User found:", user.email);
    console.log("LOGIN BODY:", req.body);
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password incorrect");
      return res.status(400).json({ message: "Invalid password" });
    }

    // Trainer approval check
    if (user.role === "trainer" && !user.isApproved) {
      return res.status(403).json({
        message: "Trainer not approved yet",
      });
    }

    // Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "member",
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// // 🚨 Trainer approval check
// if (user.role === "trainer" && !user.isApproved) {
//   return res.status(403).json({
//     message: "Trainer not approved yet"
//   });
// }

// Create JWT token
// const token = jwt.sign(
//   { id: user._id, role: user.role },
//  process.env.JWT_SECRET,
//   { expiresIn: "1d" }
// );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//forgot password

const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // ✅ reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      You requested a password reset.

      Click here to reset:
      ${resetUrl}
    `;

    try {
      await sendEmail(user.email, "Password Reset", message);
    } catch (err) {
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      return res.status(500).json({ message: "Email could not be sent" });
    }

    res.json({ message: "Reset link sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Reset password
exports.resetPassword = async (req, res) => {
  try {


    // hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};