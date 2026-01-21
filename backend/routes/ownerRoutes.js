
const express = require("express");
const router = express.Router();
const {
  uploadOwnerItem,
  getAllItems,
  createOrder,
  getOwnerOrders,
  updateItem,
  deleteItem,
  getOwnerItems,
  updateOrderStatus,
  getStudentOrders,
} = require("../controllers/ownerController");
const { protect } = require("../middlewares/verifyToken");
const multer = require("multer");
const path = require("path");

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)),
});

const upload = multer({ storage });

// 🔽 ROUTES
router.post("/upload", protect, upload.single("image"), uploadOwnerItem);
router.get("/items/all", getAllItems); // ✅ USE CONTROLLER FUNCTION
router.get("/orders", protect, getOwnerOrders);
router.post("/order", protect, createOrder);
 // student places order
router.get("/my-items", protect, getOwnerItems);
router.put("/item/:id", protect, upload.single("image"), updateItem);
router.delete("/item/:id", protect, deleteItem);
router.put("/order/status/:id", protect, updateOrderStatus);
router.get("/student-orders", protect, getStudentOrders);

module.exports = router;
