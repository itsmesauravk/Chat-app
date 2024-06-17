const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on("connection", (socket) => {
  console.log('New connection');
  console.log("Id:", socket.id);
  // emit  -> messege send to perticular client
    // socket.emit('welcome', `Welcome to server (emit).`);
    // broadcast -> messege send to all client except sender
  // socket.broadcast.emit('welcome', `${socket.id} joined the s/erver (broadcast).`);

  // disconnect -> messege send to perticular client


  socket.on('message', (data) => {
    console.log(data);
    // io.emit('message', data);
    // io -> entire cilent
    // io.emit('receive-message', data) // send to all client including sender
    socket.broadcast.emit('receive-message', data) // send to all client except sender
  })

  //receive-message -> messege send to all client
  

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  console.log("Id:", socket.id);
  });

});

  

// instead of app.listen we use server.listen
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
