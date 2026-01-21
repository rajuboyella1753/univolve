const HelpReply = require("../models/helpReplyModel");
const User = require("../models/User");

const markHelpfulReply = async (req, res) => {
  const replyId = req.params.id;
  const userId = req.user._id;

  try {
    const reply = await HelpReply.findById(replyId).populate("repliedBy", "name points");
    if (!reply) return res.status(404).json({ error: "Reply not found" });

    const isAlreadyMarked = reply.helpfulMarkedBy.includes(userId);

    if (isAlreadyMarked) {
      return res.status(400).json({ message: "Already marked as helpful" });
    }

    reply.helpfulMarkedBy.push(userId);
    await reply.save();

    // Reward points to the reply owner (not the one marking helpful)
    const replyAuthor = await User.findById(reply.repliedBy._id);
    if (replyAuthor) {
      replyAuthor.points = (replyAuthor.points || 0) + 10;
      await replyAuthor.save();
    }

    res.json({
      message: "Marked as helpful and points added",
      helpfulBy: reply.repliedBy.name, // Send B's name to frontend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markHelpfulReply,
};
