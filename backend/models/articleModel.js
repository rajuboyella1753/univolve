// 📁 models/articleModel.js

const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    theme: { type: String, required: true },
    purpose: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
