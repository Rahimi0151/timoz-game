const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.post('/signup', validateUser.create, async(req, res) => {
    let hashedPassword
    try {hashedPassword = await bcrypt.hash(req.body.password, 10);}
    catch (err) {res.status(500).json({message: 'someting went wrong'})}

    let userInDB = await User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
    if (userInDB) {
        return res.status(400).json({message: 'username/email already taken'})}

    const user = new User({
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
    })

    userInDB = await user.save()

    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)
    // console.log(req.body)

    req.body.password = hashedPassword
    res.json(req.body);
});


module.exports = router;
