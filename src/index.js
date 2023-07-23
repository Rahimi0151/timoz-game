const http = require('http');
const express = require('express');
const socketIo = require('socket.io')

// routes
const users = require('./routes/users')
const games = require('./routes/games').router
const quizes = require('./routes/quizes')

const app = express();
const server = http.createServer(app);
const io = socketIo(server)


let port = process.env.PORT
if(process.env.NODE_ENV == 'test') port = Math.floor(Math.random()*60000)+5000;


// Middleware
app.use(express.json());

// Routes
app.use('/api/game',games)
app.use('/api/quiz',quizes)
app.use('/api/users',users)

//sockets
require('./routes/games').io(io);

// Start
require('./start/database')()

app.get('/api/start/test', async (req, res) => {
  res.send('Hello, world!');
});

// Start the server
server.listen(port, () => {});

module.exports = { server }