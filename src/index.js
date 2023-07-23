const users = require('./routes/users')
const games = require('./routes/games')
const quizes = require('./routes/quizes')
const express = require('express');
const app = express();
let port = process.env.PORT
const socketIo = require('socket.io')


if(process.env.NODE_ENV == 'test') port = Math.floor(Math.random()*60000)+5000;


// Middleware
app.use(express.json());

// Routes
app.use('/api/game',games)
app.use('/api/quiz',quizes)
app.use('/api/users',users)

// Start
require('./start/database')()

app.get('/api/start/test', async (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const server = app.listen(port, () => {});
const io = socketIo(server)

module.exports = {server, io}