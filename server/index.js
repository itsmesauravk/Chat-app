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
    socket.emit('welcome', `Welcome to server (emit).`);

    // broadcast -> messege send to all client except sender
  socket.broadcast.emit('welcome', `${socket.id} joined the server (broadcast).`);
});

  

// instead of app.listen we use server.listen
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
