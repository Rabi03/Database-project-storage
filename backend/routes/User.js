const { registration, login, getCurrentUser } = require('../controllers/userControllers');

const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const router=express.Router();

router.route('/register').post(registration);

router.route("/login").post(login);

router.route('/me').get(isAuthenticated,getCurrentUser);

module.exports = router;
