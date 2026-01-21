const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { protect } = require("../middlewares/authMiddleware");
const Suggestion = require("../models/Suggestion");

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const image = req.file;

    if (!type || !title || !message) {
      return res.status(400).json({ error: "Type, title, and message are required" });
    }

    const suggestion = new Suggestion({
      studentId: req.user._id, // ✅ KEY FIX HERE
      type,
      title,
      message,
      imageUrl: image ? `/uploads/suggestions/${image.filename}` : null,
    });

    await suggestion.save();
    res.status(201).json({ message: "Suggestion submitted", suggestion });
  } catch (err) {
    console.error("❌ Suggestion POST error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
});

router.get("/mine", protect, async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    console.error("❌ Fetch user suggestions failed:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});
// ✅ Get all suggestions — for SuperAdmin
router.get("/", protect, async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    console.error("❌ Failed to fetch suggestions:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});
// DELETE a suggestion by ID
router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Suggestion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Suggestion not found" });
    }
    res.json({ message: "Suggestion deleted successfully" });
  } catch (err) {
    console.error("Error deleting suggestion:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
