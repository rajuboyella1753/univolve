const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { protect } = require("../middlewares/authMiddleware");

const {
  uploadPost,
  getAllPosts,
  likePost,
  commentPost,
  editPost,
  deletePost,
  editComment,
  deleteComment,
} = require("../controllers/publicPostController");

// 📌 Post Routes
router.post("/upload", protect, upload.single("file"), uploadPost);
router.get("/", protect, getAllPosts);
router.post("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);
router.put("/:id", protect, editPost);            // 🆕 Edit Post
router.delete("/:id", protect, deletePost);       // 🆕 Delete Post

// 📌 Comment Routes
router.put("/:postId/comments/:commentId", protect, editComment);     // 🆕 Edit Comment
router.delete("/:postId/comments/:commentId", protect, deleteComment); // 🆕 Delete Comment

module.exports = router;
