const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validate/user')
const Quiz = require('../models/quiz')
const config = require('config')
const jwt = require('jsonwebtoken')
const _ = require('underscore')
const util = require('util');
const redis = require('../start/redis').getClient()


router.get('/', validateUser.isLogin, async(req, res) => {
    const activeQuiz = await Quiz.findOne({active: true})
    if (!activeQuiz) return res.status(400).json({message: "there is no active quiz"})

    res.status(200).json({quizTitle: activeQuiz.title});
});

//TODO:: add all the required socket connections

const io = (io) => {
    io.on('connection', (socket) => {
        socket.users = []
        socket.theCurrentQuestion = {}
        socket.on('join', async(data) => {
            jwt.verify(data.jwt, config.get('jwt-secret-key'), (error, decodedToken) => {
                socket.user = decodedToken
                socket.users.push(decodedToken)
            })
            socket.quiz = await Quiz.findOne({title: data.quizTitle})
            await redis.set('quizTitle', JSON.stringify(data.quizTitle))
            socket.join(data.quizTitle)
            io.in(data.quizTitle).emit('join', `please wait for game to start in room: ${data.quizTitle}`)
        });

        socket.on('next-question', async(data) => {
            jwt.verify(data.token, config.get('jwt-secret-key'), async(err, decodedToken) => {
                if (err) {socket.emit('next-question', "error")}
                if (decodedToken.role != "seyyed") {return socket.emit('next-question', "you are not seyyed")}
                
                socket.theCurrentQuestion = socket.quiz.questions.shift()
                await redis.set('current-question',JSON.stringify(socket.theCurrentQuestion))
                const thisQuestion = _.pick(socket.theCurrentQuestion, [
                    'questionTitle', 'difficulty', 'answer1', 'answer2', 'answer3', 'answer4'
                ])
                io.in(socket.quiz.title).emit('next-question', thisQuestion)
                
                setTimeout(()=>{
                    io.in(socket.quiz.title).emit('time-up', 'times up!')
                },config.get('time-to-answer'))
                return
            });
        });
        socket.on('answer', async(data) => {
            const quizTitle = JSON.parse(await redis.get('quizTitle'))
            jwt.verify(data.token, config.get('jwt-secret-key'), async(err, decodedToken) => {
                if (err) {socket.emit('next-question', "error")}
                const redisCurrent = JSON.parse(await redis.get('current-question'))
                if (data.answer != redisCurrent.correctAnswer){
                    socket.emit('answer', 'wrong answer! you lost!')
                }
                return socket.emit('join', `please wait for next question in room: ${quizTitle}`)
            });
        });
    });
};
  
module.exports = { router, io };
