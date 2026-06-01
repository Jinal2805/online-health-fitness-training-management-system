const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");


// ==============================
// 🟢 CREATE PAYMENT ORDER
// ==============================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
});


// ==============================
// 🟢 VERIFY PAYMENT + CREATE BOOKING
// ==============================
router.post("/verify-payment", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      trainerId,
      date,
      time,
      price
    } = req.body;

    // 🔐 Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ❗ Prevent duplicate booking
    const existing = await Booking.findOne({
      trainer: trainerId,
      date,
      time,
      status: { $ne: "cancelled" }
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      member: req.user.id,
      trainer: trainerId,
      date,
      time,
      price,
      status: "paid"
    });

    res.json({ success: true, booking });

  } catch (err) {
    res.status(500).json({ message: "Verification failed" });
  }
});


// ==============================
// 🟢 GET MEMBER BOOKINGS
// ==============================
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ member: req.user.id })
      .populate("trainer", "name email profileImage");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


// ==============================
// 🟢 GET TRAINER BOOKINGS
// ==============================
router.get("/trainer-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ trainer: req.user.id })
      .populate("member", "name email");

    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


// ==============================
// 🟢 CANCEL BOOKING (MEMBER)
// ==============================
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only member can cancel
    if (booking.member.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });

  } catch (err) {
    res.status(500).json({ message: "Cancel failed" });
  }
});


// ==============================
// 🟢 UPDATE STATUS (TRAINER)
// ==============================
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only trainer can update
    if (booking.trainer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Status updated", booking });

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


// ==============================
module.exports = router;