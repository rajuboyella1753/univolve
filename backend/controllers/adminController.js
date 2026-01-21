// controllers/adminController.js
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approved = true;
    user.rejected = false; // 💡 Reset rejection
    await user.save();

    res.json({ message: "✅ User approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving user", error: err.message });
  }
};

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approved = false;
    user.rejected = true; // 💡 Mark as rejected
    await user.save();

    res.json({ message: "❌ User rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting user", error: err.message });
  }
};

