const express = require("express");
const router = express.Router();

const {
  createProblem,
  getProblemsByGender,
  addReply,
  editProblem,
  deleteProblem,
  editReply,
  deleteReply,
} = require("../controllers/problemController");

router.post("/", createProblem);
router.get("/:gender", getProblemsByGender);
router.post("/:id/reply", addReply);
router.put("/:id", editProblem);
router.delete("/:id", deleteProblem);
router.put("/:problemId/reply/:replyIndex", editReply);
router.delete("/:problemId/reply/:replyIndex", deleteReply);

module.exports = router;

