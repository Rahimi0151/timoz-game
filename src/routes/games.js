const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const Quiz = require('../models/quiz')
const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('underscore')

router.get('/', validateUser.isLogin, async(req, res) => {
    const activeQuiz = await Quiz.findOne({active: true})
    if (!activeQuiz) return res.status(400).json({message: "there is no active quiz"})

    res.status(200).json({quizTitle: activeQuiz.title});
});

//TODO:: add all the required socket connections

const io = (io) => {
    io.on('connection', (socket) => {
        let quiz     
        socket.on('join', async(data) => {
            quiz = await Quiz.findOne({title: data.quizTitle})
            socket.join(data.quizTitle)
            io.in(data.quizTitle).emit('join', `please wait for game to start in room: ${data.quizTitle}`)
        });

        socket.on('next-question', async(data) => {
            jwt.verify(data.token, config.get('jwt-secret-key'), (err, decodedToken) => {
                if (err) {socket.emit('next-question', "error")}
                if (decodedToken.role != "seyyed") {return socket.emit('next-question', "you are not seyyed")}
                
                const thisQuestion = _.pick(quiz.questions.shift(), [
                    'questionTitle', 'difficulty', 'answer1', 'answer2', 'answer3', 'answer4'
                ])
                io.in(quiz.title).emit('next-question', thisQuestion)
                return
            });
        });
    });
};
  
module.exports = { router, io };
