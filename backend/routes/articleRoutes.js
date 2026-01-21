// 📁 routes/articleRoutes.js

const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

// ✅ Use your dynamic multer config
const upload = require("../middlewares/multerConfig");

// 📌 POST: Create new article with image
router.post("/upload", upload.single("image"), articleController.postArticle);

// 📌 GET: Fetch all articles
router.get("/", articleController.getArticles);

// 📌 PUT: Update article by ID
router.put("/:id", upload.single("image"), articleController.updateArticle);

// 📌 DELETE: Delete article by ID
router.delete("/:id", articleController.deleteArticle);

module.exports = router;
