const express = require("express");
const router = express.Router();
const HelpReply = require("../models/helpReplyModel");
const User = require("../models/User");
const { markHelpfulReply } = require("../controllers/helpReplyController");
// const authMiddleware = require("../middlewares/authMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// Get replies for a specific question
router.get("/:questionId", async (req, res) => {
  try {
    const replies = await HelpReply.find({ questionId: req.params.questionId })
      .sort({ createdAt: -1 })
      .populate("repliedBy", "name"); // ✅ Populate to get user name

    res.json(replies);
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Post a reply to a question
router.post("/", protect, async (req, res) => {
  try {
    const { questionId, replyText } = req.body;

    const reply = new HelpReply({
      questionId,
      replyText,
      repliedBy: req.user._id, // ✅ Logged-in user's ID
    });

    await reply.save();
    res.status(201).json(reply);
  } catch (err) {
    console.error("Error posting reply:", err);
    res.status(500).json({ error: "Failed to post reply" });
  }
});

// Mark reply as helpful and reward 10 points
router.post("/:id/mark-helpful", protect, async (req, res) => {
  try {
    const reply = await HelpReply.findById(req.params.id);
    if (!reply) return res.status(404).json({ error: "Reply not found" });

    // Prevent double marking
    if (reply.helpfulMarkedBy.includes(req.user._id)) {
      return res.status(400).json({ error: "Already marked as helpful" });
    }

    // Mark as helpful
    reply.helpfulMarkedBy.push(req.user._id);
    await reply.save();

    // Reward points to the reply owner
    if (reply.repliedBy) {
      await User.findByIdAndUpdate(reply.repliedBy, {
        $inc: { points: 10 },
      });
    }

    res.json({ message: "Marked as helpful and points added" });
  } catch (err) {
    console.error("Error in marking helpful:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/replies/:id/mark-helpful", protect, markHelpfulReply);
module.exports = router;
