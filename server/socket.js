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
  }
);

  

  // // Middleware for socket authentication
  // io.use((socket, next) => {
  //   cookieParser()(socket.request, socket.request.res, (err) => {
  //     if (err) return next(new Error('Authentication error'));

  //     const token = socket.request.cookies.token;

  //     if (!token) return next(new Error('Authentication error'));

  //     try {
  //       const decoded = jwt.verify(token, secretKeyJwt);
  //       socket.decoded = decoded; // Attach decoded token to socket object
  //       next();
  //     } catch (error) {
  //       return next(new Error('Authentication error'));
  //     }
  //   });
  // });

  

  io.on("connection", (socket) => {
    console.log('New connection');
    console.log("Id:", socket.id);
    // emit  -> messege send to particular client
      // socket.emit('welcome', `Welcome to server (emit).`);
      // broadcast -> messege send to all client except sender
    // socket.broadcast.emit('welcome', `${socket.id} joined the s/erver (broadcast).`);
  
    // disconnect -> messege send to perticular client
  
  
    socket.on('message', (data) => {
      console.log(data);
      // io.emit('message', data);
      // io -> entire cilent
      // io.emit('receive-message', data) // send to all client including sender
      // socket.broadcast.emit('receive-message', data) // send to all client except sender
  
      io.to(data.room).emit('receive-message', data.message)  // send to all client in particular room
    })
    //receive-message -> messege send to all client
  
  
    //for joining room
    socket.on('join', (group) => {
      socket.join(group);
      console.log(`${socket.id} joined ${group}`);
      socket.emit('joined', `You joined ${group}`);
    })
    
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    console.log("Id:", socket.id);
    });
  
  });
  
    
  
  // instead of app.listen we use server.listen
  server.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
  

  return io;
}

module.exports = initializeSocket;
