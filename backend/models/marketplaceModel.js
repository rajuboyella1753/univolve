// models/marketplaceModel.js
const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  price: Number,
  sellerName: String,
  mobile: String,
  image: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 🔐 store who posted this item
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Marketplace', marketplaceSchema);
