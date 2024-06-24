// app.js or a new file like userRoutes.js
const express = require('express');
const router = express.Router();
const {
    loginUser,
    getProfile,
    getUsers,
    logout
} = require('../controller/userLogin');

const userAuth = require('../middleware/userAuth');


router.route('/login').post(loginUser);
router.route('/get-profile').get(userAuth,getProfile)
router.route('/get-users').get(userAuth, getUsers)
router.route('/logout').get(userAuth,logout)

module.exports = router;
