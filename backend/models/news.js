const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: String, // optional
    video: String, // optional
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Content Admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
