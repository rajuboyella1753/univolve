const LibraryBook = require("../models/LibraryBook");
const path = require("path");

// ✅ Add Book
exports.addBook = async (req, res) => {
  try {
    const { title, description, floor, location } = req.body;

    if (!title || !description || !floor || !location) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const imagePath = req.file ? `/uploads/books/${req.file.filename}` : "";

    const newBook = new LibraryBook({
      title,
      description,
      floor,
      location,
      imagePath,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("❌ Error adding book:", err);
    res.status(500).json({ error: "Server error while adding book." });
  }
};

// ✅ Get Books
exports.getBooks = async (req, res) => {
  try {
    const { title, floor } = req.query;

    const filter = {};

    // 🔍 Title search
    if (title && title.trim() !== "") {
      filter.title = { $regex: title, $options: "i" };
    }

    // 🏢 Floor filter
    if (floor && floor !== "all") {
      filter.floor = floor;
    }

    const books = await LibraryBook.find(filter).sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await LibraryBook.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found." });
    }
    res.json(updatedBook);
  } catch (err) {
    console.error("❌ Error updating book:", err);
    res.status(500).json({ error: "Server error while updating book." });
  }
};

// ✅ Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await LibraryBook.findByIdAndDelete(id);
    res.json({ message: "Book deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting book:", err);
    res.status(500).json({ error: "Server error while deleting book." });
  }
};
