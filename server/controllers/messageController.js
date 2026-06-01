const Message = require("../models/Message");


// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const io = req.app.get("io");

    const message = await Message.create(req.body);

    const populatedMessage = await message.populate("sender", "name");
    await populatedMessage.populate("receiver", "name");

    const receiverId = message.receiver.toString();

    // =========================
    // 1. REAL-TIME CHAT EVENT
    // =========================
    io.to(receiverId).emit("new_message", populatedMessage);

    // =========================
    // 2. NOTIFICATION EVENT (ADD THIS)
    // =========================
    io.to(receiverId).emit("newNotification", {
      title: "New Message",
      message: `${populatedMessage.sender.name} sent you a message`,
      type: "trainer",
      isRead: false,
      important: false,
      time: new Date().toLocaleTimeString(),
    });

    res.status(201).json(populatedMessage);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET CONVERSATION
exports.getConversation = async (req, res) => {

  try {

    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};