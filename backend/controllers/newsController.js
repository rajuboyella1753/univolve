const News = require("../models/news");

// ✅ Create a news post
const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const userId = req.user?.id || req.user?._id; // assuming middleware adds user

    const newPost = new News({
      title,
      content,
      image,
      postedBy: userId,
    });

    await newPost.save();
    res.status(201).json({ message: "✅ News posted successfully", data: newPost });
  } catch (err) {
    console.error("❌ Error in createNews:", err);
    res.status(500).json({ error: "Server Error while posting news" });
  }
};


// ✅ Get all news posts
const getAllNews = async (req, res) => {
  try {
    const newsList = await News.find().sort({ createdAt: -1 });
    res.status(200).json(newsList);
  } catch (err) {
    console.error("❌ Error in getAllNews:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};
const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "News not found" });

    res.status(200).json({ message: "✅ News deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteNews:", err);
    res.status(500).json({ error: "Failed to delete news" });
  }
};
const updateNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateFields = { title, content };
    if (image) updateFields.image = image;

    const updated = await News.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "News not found" });
    }

    res.status(200).json({ message: "✅ News updated", data: updated });
  } catch (err) {
    console.error("❌ Error in updateNews:", err);
    res.status(500).json({ error: "Failed to update news" });
  }
};
module.exports = {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
};
