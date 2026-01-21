const Problem = require("../models/Problem");

// 🔵 CREATE Problem
exports.createProblem = async (req, res) => {
  const { text, gender, userId } = req.body;
  const problem = new Problem({ text, gender, userId });
  await problem.save();
  res.status(201).json(problem);
};

// 🟢 GET Problems by gender
exports.getProblemsByGender = async (req, res) => {
  const gender = req.params.gender;
  const problems = await Problem.find({ gender }).sort({ createdAt: -1 });
  res.status(200).json(problems);
};

// 🔁 ADD Reply
exports.addReply = async (req, res) => {
  const { id } = req.params;
  const { text, userId } = req.body;
  const problem = await Problem.findById(id);
  problem.replies.unshift({ text, userId });
  await problem.save();
  res.status(201).json(problem);
};

// ✏ EDIT Problem
exports.editProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    problem.text = text;
    await problem.save();

    res.status(200).json({ message: "Problem updated" });
  } catch (err) {
    console.error("❌ Edit Problem Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑 DELETE Problem
exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ message: "Problem deleted" });
  } catch (err) {
    console.error("❌ Delete Problem Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✏ EDIT Reply
exports.editReply = async (req, res) => {
  try {
    const { problemId, replyIndex } = req.params;
    const { text } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (!problem.replies[replyIndex]) {
      return res.status(404).json({ message: "Reply not found" });
    }
    problem.replies[replyIndex].text = text;
    await problem.save();
    res.status(200).json({ message: "Reply updated" });
  } catch (err) {
    console.error("❌ Edit Reply Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🗑 DELETE Reply
exports.deleteReply = async (req, res) => {
  try {
    const { problemId, replyIndex } = req.params;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    if (!problem.replies[replyIndex]) {
      return res.status(404).json({ message: "Reply not found" });
    }
    problem.replies.splice(replyIndex, 1);
    await problem.save();
    res.status(200).json({ message: "Reply deleted" });
  } catch (err) {
    console.error("❌ Delete Reply Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
