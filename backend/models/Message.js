const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'roomType' },
  roomType: { type: String, enum: ['ChatRoom', 'GroupRoom'], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
