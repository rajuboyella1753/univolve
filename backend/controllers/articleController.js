// 📁 controllers/articleController.js

const Article = require("../models/articleModel");
const path = require("path");
const fs = require("fs");

exports.postArticle = async (req, res) => {
  try {
    const { theme, purpose, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newArticle = new Article({ theme, purpose, content, image });
    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to post article" });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { theme, purpose, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const existing = await Article.findById(id);
    if (!existing) return res.status(404).json({ error: "Article not found" });

    // Delete old image if new one is uploaded
    if (image && existing.image) {
      const oldImagePath = path.join(__dirname, "../uploads/articles/", existing.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updateFields = {
      theme,
      purpose,
      content,
    };

    if (image) updateFields.image = image;

    const updated = await Article.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating article:", err);
    res.status(500).json({ error: "Failed to update article" });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);

    if (!article) return res.status(404).json({ error: "Article not found" });

    // Delete image if it exists
    if (article.image) {
      const filePath = path.join(__dirname, "../uploads/articles/", article.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};
