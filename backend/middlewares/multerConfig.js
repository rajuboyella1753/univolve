// multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/chat";

    if (req.originalUrl.includes("/happiness")) {
      folder = "uploads/happiness";
    } else if (req.originalUrl.includes("/marketplace")) {
      folder = "uploads/sell";
    } else if (req.originalUrl.includes("/articles")) {
      folder = "uploads/articles";
    } else if (req.originalUrl.includes("/suggestions")) {
      folder = "uploads/suggestions";
    } else if (req.originalUrl.includes("/memories")) {
      folder = "uploads/memories";
    } else if (req.originalUrl.includes("/freelance")) {
      folder = "uploads/freelancers";
    }

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

// ✅ Updated: Allow both image and video types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|mp4|mov|avi|webm/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
