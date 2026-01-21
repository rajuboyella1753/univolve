const HappyPlace = require("../models/happyPlaceModel");

exports.uploadHappyPlace = async (req, res) => {
  try {
    const { placeName, description } = req.body;
    const file = req.file;

    const newPost = new HappyPlace({
      userId: req.user.id,
      userName: req.user.name,
      placeName,
      description,
      imageUrl: file ? `/uploads/happiness/${file.filename}` : "",
    });

    await newPost.save();
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload place" });
  }
};

exports.getHappyPlaces = async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter.placeName = { $regex: search, $options: "i" };
    }

    const posts = await HappyPlace.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch places" });
  }
};

exports.likeHappyPlace = async (req, res) => {
  try {
    const post = await HappyPlace.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: "Like updated", likes: post.likes });
  } catch (err) {
    res.status(500).json({ message: "Failed to update like" });
  }
};

exports.commentHappyPlace = async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await HappyPlace.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: req.user.id,
      name: req.user.name,
      comment,
    });

    await post.save();
    res.json({ message: "Comment added", comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};
