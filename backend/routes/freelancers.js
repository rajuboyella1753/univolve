const express = require("express");
const router = express.Router();
const { registerFreelancer, getFreelancers } = require("../controllers/freelancerController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");

// Route: POST /api/freelancers/register
router.post("/register", protect, upload.array("samples", 10), registerFreelancer);

// Route: GET /api/freelancers
router.get("/", protect, getFreelancers);

module.exports = router;
