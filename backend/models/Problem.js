const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  text: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const problemSchema = new mongoose.Schema({
  text: String,
  gender: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  replies: [replySchema],
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);