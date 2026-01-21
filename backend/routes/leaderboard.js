const express = require("express");
const router = express.Router();
const Reply = require("../models/helpReplyModel");
const User = require("../models/User"); // or wherever your User model is

router.get("/top-solvers", async (req, res) => {
  try {
   const pipeline = [
  {
    $project: {
      repliedBy: 1,
      helpfulCount: { $size: { $ifNull: ["$helpfulMarkedBy", []] } }
    }
  },
  {
    $group: {
      _id: "$repliedBy", // Group by the person who wrote the reply
      totalPoints: { $sum: { $multiply: ["$helpfulCount", 10] } }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userInfo"
    }
  },
  { $unwind: "$userInfo" },
  {
    $project: {
      _id: 0,
      userId: "$userInfo._id",
      name: "$userInfo.name",
      email: "$userInfo.email",
      totalPoints: 1
    }
  },
  { $sort: { totalPoints: -1 } },
  { $limit: 10 }
];


 const leaderboard = await Reply.aggregate(pipeline);

    res.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
