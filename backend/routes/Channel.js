const express = require('express');
const router=express.Router();

const {
    fetchChannels,
  } = require("../controllers/channelControllers");
const { authorizedMember, isAuthenticated } = require('../middleware/auth');


router.route("/myChannel").get(isAuthenticated,fetchChannels);
module.exports = router;
