const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const secretKeyJwt = process.env.JWT_SECRET

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true
    }
  });

  // Middleware for socket authentication
  io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(new Error('Authentication error'));

      const token = socket.request.cookies.token;

      if (!token) return next(new Error('Authentication error'));

      try {
        const decoded = jwt.verify(token, secretKeyJwt);
        socket.decoded = decoded; // Attach decoded token to socket object
        next();
      } catch (error) {
        return next(new Error('Authentication error'));
      }
    });
  });

  io.on("connection", (socket) => {
    console.log('New connection');
    console.log("Id:", socket.id);

    // Your socket event handlers here...

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      console.log("Id:", socket.id);
    });
  });

  return io;
}

module.exports = initializeSocket;
