const users = require('./routes/users')
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());

// Routes
app.use(users)

// Start
require('./start/database')()

app.get('/api/start/test', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server