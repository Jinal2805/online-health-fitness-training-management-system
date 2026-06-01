const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes.js");
const memberRoutes = require("./routes/memberRoutes.js");
const workoutRoutes = require("./routes/workoutRoutes.js");
const videoRoutes = require("./routes/videoRoutes.js");
const nutritionRoutes = require("./routes/nutritionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const planRoutes = require("./routes/planRoutes");
const messageRoutes = require("./routes/messageRoutes");

const http = require("http");
const { Server } = require("socket.io");

const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// ===============================
// DATABASE
// ===============================
(async () => {
  await connectDB();
  console.log("DB Ready");
})();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({
  limit: "50mb",
  extended: true,
}));

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/trainers", trainerRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/users", userRoutes);

app.use("/api/contact", contactRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/members", memberRoutes);

app.use("/api/workouts", workoutRoutes);

app.use("/api/videos", videoRoutes);

app.use("/api/nutrition", nutritionRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/plans", planRoutes);

app.use("/api/messages", messageRoutes);

// ===============================
// TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Fitness Management API Running");
});

// ===============================
// HTTP SERVER
// ===============================
const server = http.createServer(app);

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ===============================
// SOCKET CONNECTION
// ===============================
io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // ===============================
  // NORMAL USER ROOM
  // ===============================
  socket.on("join", (userId) => {

    socket.join(userId);

    console.log("User joined room:", userId);

  });

  // ===============================
  // VIDEO CALL ROOM
  // ===============================
  socket.on("join-room", (roomId) => {

    socket.join(roomId);

    socket.to(roomId).emit("user-joined");

    console.log("JOIN ROOM:", roomId);

  });

  // ===============================
  // OFFER
  // ===============================
  socket.on("offer", ({ roomId, offer }) => {

    socket.to(roomId).emit("offer", offer);

  });

  // ===============================
  // ANSWER
  // ===============================
  socket.on("answer", ({ roomId, answer }) => {

    socket.to(roomId).emit("answer", answer);

  });

  // ===============================
  // ICE CANDIDATE
  // ===============================
  socket.on("ice-candidate", ({ roomId, candidate }) => {

    socket.to(roomId).emit("ice-candidate", candidate);

  });

  // ===============================
  // DISCONNECT
  // ===============================
  socket.on("disconnect", () => {

    console.log("User Disconnected:", socket.id);

  });

});

// ===============================
// GLOBAL IO
// ===============================
app.set("io", io);

// ===============================
// START SERVER
// ===============================
server.listen(5000, () => {
  console.log("Server running on port 5000");
});