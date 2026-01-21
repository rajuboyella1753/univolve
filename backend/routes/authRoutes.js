const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// ✅ Auth routes
router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/profile", protect, getProfile);

module.exports = router;
