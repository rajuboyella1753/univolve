const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const ChatRequest = require("../models/ChatRequest");
const User = require("../models/User");

exports.sendChatRequest = async (req, res) => {
  try {
    const { toEmail } = req.body;
    const fromUserId = req.user._id;

    const toUser = await User.findOne({ email: toEmail });
    if (!toUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const from = fromUserId;
    const to = toUser._id;

    // Check for existing pending request
    const existingRequest = await ChatRequest.findOne({
      sender: from,
      receiver: to,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    // Check if chat room already exists
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: [from, to] },
    });

    if (existingRoom) {
      return res.status(400).json({ error: "Chat room already exists" });
    }

    // ✅ Save chat request
    const newRequest = new ChatRequest({
      sender: from,
      receiver: to,
      status: "pending",
    });
    await newRequest.save();

    // ✅ Create a ChatRoom with pending status
    const newRoom = new ChatRoom({
      participants: [from, to],
      status: "pending",
      requestedBy: from,
    });
    await newRoom.save();

    res.status(200).json({ message: "Chat request and room created successfully" });

  } catch (error) {
    console.error("Error in sendChatRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await ChatRequest.find({ to: userId, status: "pending" }).populate("from", "name email");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getIncomingRequests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Accept a request
exports.acceptChatRequest = async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await ChatRoom.findByIdAndUpdate(
      roomId,
      { status: "accepted" },
      { new: true }
    );
    res.json({ message: "Chat request accepted", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept chat request." });
  }
};

// Decline a request
exports.declineChatRequest = async (req, res) => {
  const { roomId } = req.body;

  try {
    await ChatRoom.findByIdAndUpdate(roomId, { status: "declined" });
    res.json({ message: "Chat request declined" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to decline chat request." });
  }
};

// Send private message (only if accepted)
exports.sendPrivateMessage = async (req, res) => {
  const { roomId, text, sender } = req.body;

  try {
    const room = await ChatRoom.findById(roomId);

    if (!room || room.status !== "accepted") {
      return res.status(403).json({ error: "Chat not accepted yet." });
    }

    const message = await Message.create({
      roomId,
      roomType: "ChatRoom",
      sender,
      text,
    });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Message send failed" });
  }
};

// Get messages
exports.getPrivateMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({
      roomId,
      roomType: "ChatRoom",
    }).populate("sender", "name");

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Message fetch failed" });
  }
};
