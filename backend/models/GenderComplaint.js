const mongoose = require('mongoose');

const genderComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gender: String,
  problemText: String,
  image: String,
  audio: { type: String }, // Optional audio file path
  video: { type: String }, // Optional video file path
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "in progress", "solved"],
    default: "pending"
  },
  officerRemarks: [
  {
    text: { type: String, required: true },
    by: { type: String, required: true },
    at: { type: Date, default: Date.now }
  }
],

  officerRepliedAt: { type: Date },
  notificationSentToOfficer: { type: Boolean, default: false },
  notificationSentToStudent: { type: Boolean, default: false }
});

module.exports = mongoose.model("GenderComplaint", genderComplaintSchema);
