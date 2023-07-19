const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const bcrypt = require('bcrypt')

router.post('/signup', validateUser.create, async(req, res) => {
    let hashedPassword
    try {hashedPassword = await bcrypt.hash(req.body.password, 10);}
    catch (err) {res.status(500).json({message: 'someting went wrong'})}


    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)

    req.body.password = hashedPassword
    res.json(req.body);
});


module.exports = router;
