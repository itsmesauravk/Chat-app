const { Server } = require('socket.io');
const Person = require('../schema/users');
const Message = require('../schema/messages');

const startSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true
        }
    });

    io.on('connection', async (socket) => {
        const googleId = socket.handshake.auth.googleId;

        if (!googleId) {
            socket.disconnect();
            return;
        }

        let user = await Person.findOne({ googleId: googleId });

        if (!user) {
            socket.disconnect();
            return;
        }

        if (!user.socketId) {
            console.log(`New User > ${user.name} connected with new socket ID ${socket.id}`);
            user.socketId = socket.id;
            await user.save();
        } else {
            console.log(`Old User > ${user.name} connected with socket ID ${socket.id}`);
            user.socketId = socket.id; // Update the socket ID on every new connection
            await user.save();
        }

        socket.on('message', async (data) => {
            const sender = await Person.findOne({ googleId: data.googleId });
            const receiver = await Person.findById(data.receiverId);

            if (receiver) {
                console.log(`Message from ${sender.name} to ${receiver.name}: ${data.message}`);
                io.to(receiver.socketId).emit('receive-message', {
                    message: data.message,
                    sender: sender.name
                });

                // const newMessage = new Message({
                //     sender: sender._id,
                //     receiver: receiver._id,
                //     message: data.message
                // });

                // await newMessage.save();
                // console.log('Message saved');
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User ${user.name} disconnected`);
        });
    });

    return io;
};

module.exports = startSocket;
