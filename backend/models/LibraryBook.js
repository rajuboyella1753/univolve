const mongoose = require("mongoose");

const libraryBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  floor: String,
  imagePath: String,
  location: {
  type: String,
  required: true,
},
});

module.exports = mongoose.model("LibraryBook", libraryBookSchema);
