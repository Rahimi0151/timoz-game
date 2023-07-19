const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const _ = require('underscore')

router.post('/signup', validateUser.create, async(req, res) => {
    let hashedPassword
    try {hashedPassword = await bcrypt.hash(req.body.password, 10);}
    catch (err) {res.status(500).json({message: 'someting went wrong'})}

    const userInDB = await User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
    if (userInDB) {return res.status(400).json({message: 'username/email already taken'})}

    const user = await new User({
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
    }).save()

    res.json(_.pick(user, 'email', 'phone', 'username', 'lastName', 'firstName', ));
});


module.exports = router;
