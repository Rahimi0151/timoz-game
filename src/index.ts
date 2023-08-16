import * as http from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import connectToDatabase from './start/database';

// routes
import users from './routes/users';
const games = require('./routes/games').router
import quizes from './routes/quizes';

const app = express.default();
const server = http.createServer(app);
const io = new socketIo.Server(server)

// Middleware
app.use(express.json());

// Routes
app.use('/api/game',games)
app.use('/api/quiz',quizes)
app.use('/api/users',users)

//sockets
require('./routes/games').io(io);

// Start
connectToDatabase()

app.get('/api/start/test', async (req, res) => {
  res.send('Hello, world!');
});

// Start the server
let port = parseInt(process.env.PORT!) || 3000
if(process.env.NODE_ENV == 'test') port = Math.floor(Math.random()*60000)+5000;

const serverInstance = server.listen(port, () => {});

export { serverInstance, io }