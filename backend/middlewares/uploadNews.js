// middleware/uploadNews.js
const multer = require("multer");
const path = require("path");

const newsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/news"); // 👈 Separate folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadNews = multer({ storage: newsStorage });
module.exports = uploadNews;
