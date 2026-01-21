const mongoose = require("mongoose");

const ownerItemSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["food", "clothes", "room"], required: true },
    name: { type: String, required: true },
    price: Number,
    description: String,
    image: String,
    ownerName: {
  type: String,
  required: true,
},
gender: {
  type: String,
  enum: ["men", "women", "kids"],
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerItem", ownerItemSchema);
