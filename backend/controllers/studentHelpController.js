const HelpReply = require("../models/helpReplyModel");
const User = require("../models/User");

const markHelpfulReply = async (req, res) => {
  const replyId = req.params.id;
  const userId = req.user.id; // assuming auth middleware adds `user`

  try {
    const reply = await HelpReply.findById(replyId);
    if (!reply) return res.status(404).json({ error: "Reply not found" });

    if (reply.helpfulMarkedBy.includes(userId)) {
      return res.status(400).json({ message: "Already marked as helpful" });
    }

    reply.helpfulMarkedBy.push(userId);
    await reply.save();

    // Add 10 points to user
    const user = await User.findById(userId);
    if (user) {
      user.points = (user.points || 0) + 10;
      await user.save();
    }

    res.json({ message: "Reply marked as helpful and 10 points awarded!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markHelpfulReply,
};
