const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const Quiz = require('../models/quiz')

router.get('/', validateUser.isLogin, async(req, res) => {
    const activeQuiz = await Quiz.findOne({active: true})
    if (!activeQuiz) return res.status(400).json({message: "there is no active quiz"})

    res.status(200).json({quizId: activeQuiz._id});
});

//TODO:: add all the required socket connections

const io = (io) => {
    io.on('connection', (socket) => {    
        let questions = {}
        socket.on('join', async(data) => {
            questions = await Quiz.findById(data.quizId)
            socket.join(data.quizId)
            io.in(data.quizId).emit('join', `please wait for game to start in room: ${data.quizId}`)
        });
    });
};
  
module.exports = { router, io };
