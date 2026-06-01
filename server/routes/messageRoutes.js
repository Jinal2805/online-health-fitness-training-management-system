const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getConversation,
} = require("../controllers/messageController");


// SEND MESSAGE
router.post("/", sendMessage);


// GET CHAT
router.get("/:senderId/:receiverId", getConversation);

module.exports = router;