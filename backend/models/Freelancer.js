const mongoose = require("mongoose");

const FreelancerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    contact: { type: String, required: true },
    samples: [{ type: String }], // file paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Freelancer", FreelancerSchema);
