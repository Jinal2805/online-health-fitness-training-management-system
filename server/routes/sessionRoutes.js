const express = require("express");

const router = express.Router();

const {
  createSession,
  startSession,
  getTrainerSessions,
  getMemberSessions,
  completeSession,
  addNotes,
  markAttendance,
  endSession,
  deleteSession
} = require("../controllers/sessionController");


// CREATE
router.post("/", createSession);

router.put("/start/:id", startSession);
// TRAINER SESSIONS
router.get("/trainer/:trainerId", getTrainerSessions);


// MEMBER SESSIONS
router.get("/member/:memberId", getMemberSessions);


// COMPLETE SESSION
router.put("/complete/:id", completeSession);


// ADD NOTES
router.put("/notes/:id", addNotes);


// ATTENDANCE
router.put("/attendance/:id", markAttendance);
router.put("/end/:id", endSession);
router.delete("/:id", deleteSession);

module.exports = router;