const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupChatController");

router.post("/create", controller.createGroup);
router.post("/message", controller.sendGroupMessage);
router.get("/messages/:roomId", controller.getGroupMessages);

module.exports = router;
