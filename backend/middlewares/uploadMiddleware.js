// uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/genderComplaints";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// File type validation
const mediaFilter = (req, file, cb) => {
  const extname = /\.(jpeg|jpg|png|gif|mp3|mp4|wav|mkv|webm|ogg|mov|avi)$/.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = /^(image|audio|video)\//.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image, audio, and video files allowed!"));
  }
};

// Final upload middleware
const upload = multer({
  storage,
  fileFilter: mediaFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

module.exports = upload;
