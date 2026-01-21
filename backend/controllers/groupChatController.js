const GroupRoom = require("../models/GroupRoom");
const Message = require("../models/Message");

// Create group
exports.createGroup = async (req, res) => {
  const { name, members, createdBy } = req.body;
  try {
    const group = await GroupRoom.create({ name, members, createdBy });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: "Group creation failed" });
  }
};

// Send message to group
exports.sendGroupMessage = async (req, res) => {
  const { roomId, text, sender } = req.body;
  try {
    const message = await Message.create({
      roomId,
      roomType: "GroupRoom",
      sender,
      text,
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Group message failed" });
  }
};

// Get messages
exports.getGroupMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ roomId, roomType: "GroupRoom" }).populate("sender");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Group messages fetch failed" });
  }
};
