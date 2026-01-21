const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    student: {
      name: String,
      mobile: String,
      hostel: String,
      place: String,
      payment: String,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Owner",
    },
    ownerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Placed", "On the way", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
