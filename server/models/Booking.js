const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: String,
  time: String,
  price: Number,

  status: {
    type: String,
    enum: ["paid", "accepted", "rejected", "completed", "cancelled"],
    default: "paid"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);