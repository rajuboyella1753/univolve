const express = require("express");
const router = express.Router();
const uploadNews = require("../middlewares/uploadNews");
const { protect } = require("../middlewares/verifyToken"); // ✅ import
const { createNews, getAllNews , deleteNews , updateNews} = require("../controllers/newsController");

// ✅ POST: Protected with token + multer image upload
router.post("/", protect, uploadNews.single("image"), createNews);

// ✅ GET: Public or protected as needed
router.get("/", getAllNews);
router.delete("/:id", protect, deleteNews); 
router.put("/:id", protect, uploadNews.single("image"), updateNews);
module.exports = router;
