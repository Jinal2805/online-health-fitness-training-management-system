const Session = require("../models/Session");
const Notification = require("../models/Notification");

exports.createSession = async (req, res) => {
  try {
    console.log("🔥 HIT CREATE SESSION");

    const session = await Session.create({
      ...req.body,
      member: req.body.member || undefined,
    });

    console.log("✅ CREATED:", session);

    return res.status(201).json(session);
  } catch (error) {
    console.log("❌ ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }

};



// START SESSION
// exports.startSession = async (req, res) => {

//   try {

//     const session = await Session.findById(req.params.id);

//     if (!session) {
//       return res.status(404).json({
//         message: "Session not found"
//       });
//     }

//     // UPDATE STATUS
//     session.status = "live";

//     await session.save();

//     // CREATE NOTIFICATION
//     await Notification.create({
//       user: session.user,
//       title: "Live Session Started",
//       message: `Your trainer started "${session.title}" session`,
//       type: "trainer",
//       important: true
//     });

//     res.json({
//       message: "Session started",
//       session
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       message: "Server Error"
//     });

//   }
// };

exports.startSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    session.status = "live";

    await session.save();

    res.json({
      success: true,
      session,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// GET TRAINER SESSIONS
exports.getTrainerSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      trainer: req.params.trainerId,
    })
      .populate("member", "name email");

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET MEMBER SESSIONS
exports.getMemberSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      member: req.params.memberId,
    })
      .populate("trainer", "name email");

    res.json(sessions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// MARK SESSION COMPLETED
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
      },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ADD SESSION NOTES
exports.addNotes = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        notes: req.body.notes,
      },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// MARK ATTENDANCE
exports.markAttendance = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      {
        attendance: true,
      },
      { new: true }
    );

    res.json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.endSession = async (req, res) => {

    try {

        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        session.status = "completed";

        await session.save();

        res.json({
            success: true,
            session
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};

// DELETE SESSION
exports.deleteSession = async (req, res) => {

    try {

        await Session.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Session deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};