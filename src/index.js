const users = require('./routes/users')
const express = require('express');
const app = express();
let port = process.env.PORT

if(process.env.NODE_ENV == 'test') port = Math.floor(Math.random()*60000)+5000;


// Middleware
app.use(express.json());

// Routes
app.use('/api/users',users)

// Start
require('./start/database')()

app.get('/api/start/test', async (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server