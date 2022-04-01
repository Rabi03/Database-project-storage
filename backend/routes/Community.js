const express = require('express');
const { createCommunity, join_as_instructor, join_as_student } = require('../controllers/communityControllers');
const { isAuthenticated, authorizedRols } = require('../middleware/auth');
const router=express.Router();

router.route('/create').post(isAuthenticated,authorizedRols(2),createCommunity);
router.route('/instructor/join').post(isAuthenticated,authorizedRols(2),join_as_instructor);
router.route('/student/join').post(isAuthenticated,authorizedRols(1),join_as_student);

module.exports =router;