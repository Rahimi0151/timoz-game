import express from 'express';
const router = express.Router();
import { create, isLogin, isSeyyed } from '../middleware/validate/user';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import _ from 'underscore';


router.post('/signup', create, async(req, res) => {
    let hashedPassword
    try {hashedPassword = await bcrypt.hash(req.body.password, 10);}
    catch (err) {res.status(500).json({message: 'someting went wrong'})}

    const userInDB = await User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
    if (userInDB) {return res.status(400).json({message: 'username/email already taken'})}

    const user = await new User({
        role: 'user',
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
    }).save()
    res.status(201).json(_.pick(user, '_id', 'email', 'phone', 'username', 'lastName', 'firstName', 'role'));
});

router.post('/login', create, async(req, res) => {
    const user = await User.findOne({$or: [{username: req.body.username}, {email: req.body.username}]})
    if(!user) return res.status(400).json({message: 'incorrect email/password'})
    try {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) { return res.status(400).json({message: 'incorrect email/password'}) } 
    }
    catch (error) {
        return res.status(500).json({message: 'server error'})
    } 

    const token = await user.generateJwt()
    res.status(200).set('x-auth-token', token).json({message: 'login successful'})
});

export default router