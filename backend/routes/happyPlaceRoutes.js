const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { protect } = require("../middlewares/authMiddleware");
const {
  uploadHappyPlace,
  getHappyPlaces,
  likeHappyPlace,
  commentHappyPlace,
} = require("../controllers/happyPlaceController");

router.post("/upload", protect, upload.single("image"), uploadHappyPlace);
router.get("/", protect, getHappyPlaces);
router.post("/:id/like", protect, likeHappyPlace);
router.post("/:id/comment", protect, commentHappyPlace);

module.exports = router;
