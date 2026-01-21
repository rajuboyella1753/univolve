const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const suggestionRoutes = require("./routes/suggestions");
const privateChatRoutes = require("./routes/privateChatRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes");
const leaderboardRoutes = require("./routes/leaderboard");
const freelancerRoutes = require( "./routes/freelancers");
dotenv.config();
const app = express();

// ✅ Manual CORS Middleware (NO 'cors' package at all)
const allowedOrigins = [
  "https://sudara-43d48.web.app",
  "https://www.sudara.in",
  "https://sudara.in",
  "http://localhost:3000"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Sudara API is running!");
});

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads/memories", express.static("uploads/memories"));
app.use("/uploads/sell", express.static("uploads/sell"));
app.use('/uploads/genderComplaints', express.static('uploads/genderComplaints'));

// ✅ API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/gender-complaints", require("./routes/genderComplaintRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));
app.use("/api/owner/news", require("./routes/newsRoutes"));
app.use("/api/memories", require("./routes/memoryRoutes"));
app.use("/api/student-help", require("./routes/studentHelp"));
app.use("/api/student-help/replies", require("./routes/helpReplyRoutes"));
app.use("/api/librarybooks", require("./routes/libraryBookRoutes"));
app.use("/api/public-posts", require("./routes/publicPostRoutes"));
app.use("/api/happiness", require("./routes/happyPlaceRoutes"));
app.use("/api/marketplace", require("./routes/marketplaceRoutes"));
app.use("/api/articles", require("./routes/articleRoutes"));
app.use("/api/ai-mentor", require("./routes/aiMentorRoutes"));
app.use("/api/problems", require("./routes/problemRoutes"));
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/private", privateChatRoutes);
app.use("/api/group", groupChatRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/freelancers", freelancerRoutes);
// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Express Error:", err.stack || err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed");
    console.error(err);
  });

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
