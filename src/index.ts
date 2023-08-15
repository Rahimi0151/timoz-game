import http from 'http';
import express from 'express';
import socketIo from 'socket.io';

// routes
import users from './routes/users';
const games = require('./routes/games').router
import quizes from './routes/quizes';

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server)

let port = parseInt(process.env.PORT!)
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
const redisClient = require('./start/redis').getClient();

app.get('/api/start/test', async (req, res) => {
  res.send('Hello, world!');
});

// Start the server
server.listen(port, () => {});

module.exports = { server }