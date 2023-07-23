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
    // Socket.io connection
    io.on('connection', (socket) => {
        console.log('A user connected');
    
        // Socket.io event listener
        socket.on('join', (data) => {
            console.log('User joined room:', data.room);
        });
    
        // Disconnect event listener
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
  };
  
module.exports = { router, io };
