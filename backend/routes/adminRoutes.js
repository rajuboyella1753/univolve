
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  approveUser,
  rejectUser,
} = require("../controllers/adminController");

// ✅ Fix here:
const { protect } = require("../middlewares/verifyToken");
const isSuperAdmin = require("../middlewares/verifySuperAdmin");

// Routes for Super Admin actions
router.get("/all-users", protect, isSuperAdmin, getAllUsers);
router.post("/approve/:id", protect, isSuperAdmin, approveUser);
router.post("/reject/:id", protect, isSuperAdmin, rejectUser);

module.exports = router;
