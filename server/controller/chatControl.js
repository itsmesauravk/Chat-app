const Message = require('../schema/messages');
const Person = require('../schema/users');



// get messages of a single chat
const getMessages = async (req, res) => {
    const googleId = req.params.googleID;
    const receiverId = req.params.receiverID;

    try {
        const sender = await Person.findOne({ googleId:googleId });
        const receiver = await Person.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const messages = await Message.findOne({
            $or: [
                { sender: sender._id, receiver: receiver._id },
                { sender: receiver._id, receiver: sender._id }
            ]
        });

        if (!messages) {
            return res.status(200).json({ success: true, messages: [] });
        }
        res.status(200).json({ success: true, messages: messages.messages });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}




module.exports = {
    getMessages
}