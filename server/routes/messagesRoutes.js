const express = require('express');
const messageRouter = express.Router();

const {
    getMessages
} = require('../controller/chatControl');




messageRouter.route('/messages/:googleID/:receiverID').get(getMessages);



module.exports = messageRouter;