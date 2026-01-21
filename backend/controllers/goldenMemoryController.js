const GoldenMemory = require("../models/GoldenMemory");

// ✅ Upload new memory (max 3 per user name)
const uploadMemory = async (req, res) => {
  try {
    const { name, caption } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !caption || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Restrict to 3 memories per name
    const count = await GoldenMemory.countDocuments({ name });
    if (count >= 3) {
      return res.status(400).json({ error: "You can upload only 3 memories." });
    }

    const newMemory = new GoldenMemory({ name, caption, image });
    await newMemory.save();

    res.status(201).json({ message: "Memory uploaded successfully", data: newMemory });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all memories
const getAllMemories = async (req, res) => {
  try {
    const memories = await GoldenMemory.find().sort({ createdAt: -1 });
    res.status(200).json(memories);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Error fetching memories" });
  }
};

module.exports = {
  uploadMemory,
  getAllMemories,
};
