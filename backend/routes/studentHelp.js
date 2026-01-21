const express = require("express");
const router = express.Router();
const HelpQuestion = require("../models/helpQuestionModel");
const requireLogin = require("../middlewares/requireLogin");

// Post a question
router.post("/", requireLogin, async (req, res) => {
  try {
    const { title, description, category, branch, year } = req.body;

    const question = new HelpQuestion({
      title,
      description,
      category,
      branch,
      year,
      askedBy: req.user._id,
      createdAt: new Date(),
    });

    await question.save();
    res.status(200).json(question);
  } catch (err) {
    console.error("Error saving question:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await HelpQuestion.find()
      .populate("askedBy", "name") // optional
      .sort({ createdAt: -1 }); // latest first
    res.json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
