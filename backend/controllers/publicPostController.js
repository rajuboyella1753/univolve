const PublicPost = require("../models/publicPostModel");
const User = require("../models/User");

exports.uploadPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const file = req.file;
    const user = await User.findById(req.user.id);

    let newPost;

    if (file) {
      const type = file.mimetype.includes("video") ? "video" : "image";
      newPost = new PublicPost({
        senderId: user._id,
        senderName: user.name,
        type,
        contentUrl: `/uploads/chat/${file.filename}`, // ✅ correct
        caption,
      });
    } else {
      // 🟢 Text-only post
      newPost = new PublicPost({
        senderId: user._id,
        senderName: user.name,
        type: "text",
        caption,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};



exports.getAllPosts = async (req, res) => {
  const posts = await PublicPost.find().sort({ createdAt: -1 });
  res.json(posts);
};

exports.likePost = async (req, res) => {
  const post = await PublicPost.findById(req.params.id);
  const userId = req.user.id;
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter((id) => id != userId);
  }
  await post.save();
  res.json(post);
};

exports.commentPost = async (req, res) => {
  const post = await PublicPost.findById(req.params.id);
  const user = await User.findById(req.user.id);
  const { comment } = req.body;
  post.comments.push({
    userId: user._id,
    name: user.name,
    comment,
  });
  await post.save();
  res.json(post);
};
exports.likePost = async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    const userId = req.user.id.toString();

    const alreadyLiked = post.likes.some(id => id.toString() === userId);

    if (!alreadyLiked) {
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const post = await PublicPost.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.senderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.caption = caption;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const post = await PublicPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ✅ Ownership check
    if (post.senderId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne(); // or await PublicPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.editComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await PublicPost.findById(req.params.postId);

    const c = post.comments.id(req.params.commentId);
    if (!c) return res.status(404).json({ message: "Comment not found" });
    if (c.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    c.comment = comment;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await PublicPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // 🔒 Authorization check
    if (comment.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ SAFELY remove comment from array
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== commentId.toString()
    );

    await post.save(); // 🔥 Don't skip this

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("🔥 DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
