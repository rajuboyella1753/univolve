const express = require("express");
const router = express.Router();
const controller = require("../controllers/privateChatController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/request", protect, controller.sendChatRequest);

router.get("/requests/:userId", controller.getIncomingRequests);
router.post("/accept", controller.acceptChatRequest);
router.post("/decline", controller.declineChatRequest);

router.post("/message", controller.sendPrivateMessage);
router.get("/messages/:roomId", controller.getPrivateMessages);

module.exports = router;
