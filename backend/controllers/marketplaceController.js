const Marketplace = require('../models/marketplaceModel');

exports.sellItem = async (req, res) => {
  try {
    const { itemName, description, price, sellerName, mobile } = req.body;
    const image = req.file?.filename;

    const newItem = new Marketplace({
      itemName,
      description,
      price,
      sellerName,
      mobile,
      image,
      user: req.user._id, // ✅ attach logged-in user's ID
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post item' });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Marketplace.find()
      .sort({ createdAt: -1 })
      .populate("user", "_id name"); // 👈 THIS is the key fix

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Marketplace.findById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedFields = req.body;
    if (req.file?.filename) updatedFields.image = req.file.filename;

    const updatedItem = await Marketplace.findByIdAndUpdate(id, updatedFields, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Marketplace.findById(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
