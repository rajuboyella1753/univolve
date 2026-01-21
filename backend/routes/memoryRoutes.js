const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMemory");
const Memory = require("../models/memory");

// ✅ POST: Upload memory with userId
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const rawName = req.body.name;
    const name = rawName.trim().toLowerCase(); // Normalize name
    const caption = req.body.caption;
    const image = req.file ? req.file.filename : null;
    const userId = req.body.userId; // 👈 Get userId from frontend

    // 🛡️ Field checks
    if (!rawName || !caption || !image || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // 🔐 Limit check: Only 3 per userId (not name)
    const count = await Memory.countDocuments({ userId });
    if (count >= 3) {
      return res.status(400).json({ error: "Only 3 memories allowed per user." });
    }

    // ✅ Save memory
    const memory = new Memory({ name, caption, image, userId });
    await memory.save();

    res.status(201).json(memory);
  } catch (err) {
    console.error("❌ Memory Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ GET: Fetch all memories
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    console.error("❌ Memory Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch memories" });
  }
});
// ✅ DELETE: Only memory owner can delete (based on userId)
router.delete("/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ error: "Memory not found" });

    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    // ✅ Only allow if userId matches the memory owner's
    if (memory.userId.toString() !== userId) {
      return res.status(403).json({ error: "You can only delete your own memory" });
    }

    await memory.deleteOne();
    res.json({ message: "Memory deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
