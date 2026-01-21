const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: String,
  name: String,
  comment: String,
}, { timestamps: true });

const happyPlaceSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  placeName: String,
  description: String,
  imageUrl: String,
  likes: [String],
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model("HappyPlace", happyPlaceSchema);
