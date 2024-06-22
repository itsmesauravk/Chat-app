// app.js or a new file like userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProfile,
    logout
} = require('../controller/userLogin');



router.route('/get-profile').get(getProfile)
router.route('/logout').get(logout)

module.exports = router;
