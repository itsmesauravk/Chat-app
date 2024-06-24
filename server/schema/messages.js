const mongoose = require('mongoose');

// Define the 'MessageStore' schema
const MessageStoreSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
}, { timestamps: true });


const MessageSchema = new mongoose.Schema({
    messages: [MessageStoreSchema], 
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    room: {
        type: String,
    }
}, { timestamps: true });

// Create the 'Message' model
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
