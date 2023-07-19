const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')

router.post('/signup', validateUser.create, (req, res) => {
    res.send('Get all users');
});


module.exports = router;
