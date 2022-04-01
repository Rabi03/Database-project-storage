const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { isAuthenticated, authorizedMember } = require("../middleware/auth");


const router = express.Router();

router.route("/:community_id/:channel_id").get(isAuthenticated,authorizedMember,allMessages);
router.route("/:channel_id/send").post(isAuthenticated,sendMessage);

module.exports = router;
