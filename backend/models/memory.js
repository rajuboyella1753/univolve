const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  name: String,
  caption: String,
  image: String,
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
}, { timestamps: true });

module.exports = mongoose.model("Memory", memorySchema);
