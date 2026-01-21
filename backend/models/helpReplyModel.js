const mongoose = require("mongoose");

const helpReplySchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HelpQuestion",
    required: true,
  },
  replyText: {
    type: String,
    required: true,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  helpfulMarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("HelpReply", helpReplySchema);
