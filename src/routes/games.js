const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const Quiz = require('../models/quiz')
const io = require('../index').io

router.get('/', validateUser.isLogin, async(req, res) => {
    const activeQuiz = await Quiz.findOne({active: true})
    if (!activeQuiz) return res.status(400).json({message: "there is no active quiz"})

    res.status(200).json({message: 'you can now start the game'});
});

module.exports = router;
