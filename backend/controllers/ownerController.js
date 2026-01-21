
const OwnerItem = require("../models/OwnerItem");
const Order = require("../models/orderModel");

// Upload with image
async function uploadOwnerItem(req, res) {
  try {
    const { name, description, price, category, gender } = req.body;
    const image = req.file?.filename;

    let finalCategory = category;
    // 🔐 Extra fallback logic in case frontend fails
    if (!["food", "clothes", "room"].includes(finalCategory)) {
      switch (req.user.type) {
        case "restaurant":
          finalCategory = "food";
          break;
        case "shopping":
        case "shoppingmallowner":
          finalCategory = "clothes";
          break;
        case "hostel":
        case "hotel":
          finalCategory = "room";
          break;
        default:
          finalCategory = "food";
      }
    }

    const newItem = new OwnerItem({
      name,
      description,
      price,
      category: finalCategory,
      image,
      owner: req.user._id,
      ownerName: req.user.name,
      ...(finalCategory === "clothes" && gender ? { gender } : {}), // ✅ Add gender only for clothes
    });

    await newItem.save();
    res.status(201).json({ message: "Item uploaded successfully", item: newItem });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: "Failed to upload item" });
  }
}


// 🔍 Get all items (for student explore)
async function getAllItems(req, res) {
  try {
    const items = await OwnerItem.find().sort({ createdAt: -1 });
    console.log("✅ Items found:", items.length);
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Fetch All Items Error:", err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
}

const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      ownerId: req.user._id,
      status: { $nin: ["Delivered", "Cancelled"] }, // ✅ Exclude completed ones
    })
    .sort({ createdAt: -1 }); // ✅ Latest first

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching owner orders:", err);
    res.status(500).json({ error: "Server error fetching orders" });
  }
};

// 📦 Handle student order submission
 const createOrder = async (req, res) => {
  try {
    const {
      studentName,
      mobile,
      hostel,
      place,
      payment,
      itemId,
    } = req.body;

    console.log("🟡 Incoming Order Request:", req.body);

    const item = await OwnerItem.findById(itemId);
    if (!item) {
      console.log("❌ Item not found for ID:", itemId);
      return res.status(404).json({ message: "Item not found" });
    }
    
 
    console.log("🟢 Found Item:", item);

    const order = new Order({
      student: {
        name: studentName,
        mobile,
        hostel,
        place,
        payment,
      },
      studentId: req.user._id, // ✅ ADD THIS LINE to track the logged-in student
      item,
      ownerId: item.owner,
      ownerName: item.ownerName || "Unknown",
    });

    console.log("📦 Order to be saved:", order);

    await order.save();

    console.log("✅ Order saved successfully");

    res.status(201).json({ message: "✅ Order placed successfully!" });
  } catch (error) {
    console.error("❌ Order creation error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch owner-specific items
const getOwnerItems = async (req, res) => {
  try {
    const items = await OwnerItem.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Error fetching owner items:", err);
    res.status(500).json({ error: "Server error fetching items" });
  }
};

// Update item
const updateItem = async (req, res) => {
  try {
    const item = await OwnerItem.findOne({ _id: req.params.id, owner: req.user._id });

    if (!item) return res.status(404).json({ error: "Item not found" });

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.price = req.body.price || item.price;
    if (req.file?.filename) item.image = req.file.filename;

    await item.save();
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const item = await OwnerItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Deletion failed" });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const newStatus = req.body.status;

    console.log("🔄 Status update requested by owner:", req.user._id);
    console.log("➡️  Order ID:", orderId);
    console.log("➡️  New Status:", newStatus);

    const updated = await Order.findOneAndUpdate(
      { _id: orderId, ownerId: req.user._id },
      { $set: { status: newStatus } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    console.error("🔥 Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};





// 🔍 Student can view their orders by name+mobile (simple logic for now)
const getStudentOrders = async (req, res) => {
  try {
    const studentId = req.user._id;
    const orders = await Order.find({ studentId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching student orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};








module.exports = {
  uploadOwnerItem,
  getAllItems,
  getOwnerOrders,
  createOrder,
  getOwnerItems,
  updateItem,
  deleteItem,
  updateOrderStatus,
  getStudentOrders,
};
