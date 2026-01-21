// 📁 routes/aiMentorRoutes.js

require("dotenv").config(); // ✅ Ensure environment variables are loaded first

const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// ✅ Initialize OpenAI with secret key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔃 In-memory message usage tracker (daily limit)
const userMessageCounts = new Map(); // key = userId_date (e.g., "user123_2025-07-07")

router.post("/", async (req, res) => {
  const { message, userId } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ reply: "❌ Missing user ID or message." });
  }

  const today = new Date().toISOString().split("T")[0]; // e.g. 2025-07-07
  const key = `${userId}_${today}`;
  const count = userMessageCounts.get(key) || 0;

  const DAILY_LIMIT = 5;

  // 🚫 Limit AI usage to 5 messages per day per user
  if (count >= DAILY_LIMIT) {
    return res.json({
      reply: "⚠️ You've reached your daily AI usage limit. Please come back tomorrow.",
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Sudara AI – a supportive, caring, and knowledgeable mentor for students. Answer questions about life, rights, fitness, or emotional strength with clarity and empathy.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;
    userMessageCounts.set(key, count + 1); // ✅ Track usage

    res.json({ reply });
  } catch (err) {
    console.error("❌ AI Error:", err.message);
    res.status(500).json({
      reply: "Sudara AI is offline or facing a technical issue. Try again shortly.",
    });
  }
});

module.exports = router;
