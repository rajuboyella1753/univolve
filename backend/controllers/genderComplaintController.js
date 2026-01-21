const GenderComplaint = require("../models/GenderComplaint");
const Notification = require("../models/Notification");
const User = require("../models/User");

// ✅ Submit complaint
async function submitComplaint(req, res) {
  try {
    const { problemText } = req.body;
    const files = req.files || {};

    const imagePath = files.image ? `/uploads/genderComplaints/${files.image[0].filename}` : "";
    const audioPath = files.audio ? `/uploads/genderComplaints/${files.audio[0].filename}` : "";
    const videoPath = files.video ? `/uploads/genderComplaints/${files.video[0].filename}` : "";


    const complaint = new GenderComplaint({
      userId: req.user._id,
      gender: req.user.gender,
      problemText,
      image: imagePath,
      audio: audioPath,
      video: videoPath,
      officerRemarks: [],
    });

    await complaint.save();
    console.log("✅ Complaint saved:", complaint);

    // ✅ Send notification to relevant officer
    const officer = await User.findOne({
      role: "government",
      subrole: req.user.gender === "female" ? "disha" : "localgovt",
    });

    if (officer) {
      await Notification.create({
        userId: officer._id,
        message: `New complaint from ${req.user.name}`,
        link: `/officer/complaint/${complaint._id}`,
      });
    }

    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (err) {
    console.error("❌ Error submitting complaint:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
}

// ✅ Get complaints (Disha)
function getGirlComplaints(req, res) {
  if (req.user.role !== "government" || req.user.subrole !== "disha") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  GenderComplaint.find({ gender: "female" })
    .sort({ submittedAt: -1 })
    .then((complaints) => res.json({ complaints }))
    .catch((err) => {
      console.error("Error fetching girl complaints:", err);
      res.status(500).json({ error: "Failed to fetch girl complaints" });
    });
}

// ✅ Get complaints (Police)
function getBoyComplaints(req, res) {
  if (req.user.role !== "government" || req.user.subrole !== "localgovt") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  GenderComplaint.find({ gender: "male" })
    .sort({ submittedAt: -1 })
    .then((complaints) => res.json({ complaints }))
    .catch(() => res.status(500).json({ error: "Fetch failed" }));
}

// ✅ Student’s own complaints
function getMyComplaints(req, res) {
  GenderComplaint.find({ userId: req.user._id })
    .sort({ submittedAt: -1 })
    .then((complaints) => res.json(complaints))
    .catch(() =>
      res.status(500).json({ error: "Failed to fetch your complaints" })
    );
}

// Update Complaint Status with officer remark
async function updateStatus(req, res) {
  try {
    const complaintId = req.params.id;
    const { status, remark } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Status is required and must be a string" });
    }

    const updateData = { status };

    if (remark && remark.text && remark.by && remark.at) {
      updateData.$push = {
        officerRemarks: remark,
      };
    }

    const updatedComplaint = await GenderComplaint.findByIdAndUpdate(
      complaintId,
      updateData,
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(updatedComplaint);
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}




// ✅ Get solved female complaints
async function getSolvedGirlComplaints(req, res) {
  if (req.user.role !== "government" || req.user.subrole !== "disha") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const complaints = await GenderComplaint.find({
      gender: "female",
      status: "solved",
    }).sort({ submittedAt: -1 });

    res.json({ complaints });
  } catch (err) {
    console.error("Error fetching solved cases:", err);
    res.status(500).json({ error: "Failed to fetch solved cases" });
  }
}

module.exports = {
  submitComplaint,
  getGirlComplaints,
  getBoyComplaints,
  getMyComplaints,
  updateStatus,
  getSolvedGirlComplaints,
};
