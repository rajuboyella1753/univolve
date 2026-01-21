const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/supportAdminController");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/books/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", upload.single("image"), addBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
