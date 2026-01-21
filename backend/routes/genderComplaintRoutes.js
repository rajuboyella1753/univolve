const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const genderComplaintController = require("../controllers/genderComplaintController");
const { protect } = require("../middlewares/verifyToken");

// Gender Complaint Routes
router.post(
  "/submit",
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  genderComplaintController.submitComplaint
);

router.get("/my", protect, genderComplaintController.getMyComplaints);
router.get("/girls", protect, genderComplaintController.getGirlComplaints);
router.get("/boys", protect, genderComplaintController.getBoyComplaints);
router.put("/update-status/:id", protect, genderComplaintController.updateStatus);
router.get("/solved-girls", protect, genderComplaintController.getSolvedGirlComplaints);

module.exports = router;
