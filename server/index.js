const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initializeSocket = require('./socket');
const startSocket = require('./controller/singleChat')
const passport = require('passport');
const session = require('express-session');
const passportConfig = require('./middleware/passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoutes');

// DB connection
const connection = require('./DBconnection');
connection();

const app = express();
const server = createServer(app);



app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods:['GET','POST','DELETE','PUT','PATCH'],
  credentials: true,
}));

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// initializeSocket(server);

//single chat server
startSocket(server)

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
