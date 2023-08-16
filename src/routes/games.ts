import express from 'express';
const router = express.Router();
import { isLogin } from '../middleware/validate/user';
import Quiz from '../models/quiz';
import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'underscore';
import { Server, Socket } from 'socket.io';
import redis from '../start/redis';


router.get('/', isLogin, async(req, res) => {
    const activeQuiz = await Quiz.findOne({active: true})
    if (!activeQuiz) return res.status(400).json({message: "there is no active quiz"})

    res.status(200).json({quizTitle: activeQuiz.title});
});

//TODO:: add all the required socket connections
declare module 'jsonwebtoken'{
    interface JwtPayload {
        email: string;
        role: string;
        username: string;
        phone: string;
    }
}

declare module 'socket.io' {
    interface Socket {
        users: JwtPayload[]
        user: JwtPayload
        theCurrentQuestion: any; //TODO: change this any type
        quiz: any; //TODO: change this any type
    }
}

const io = (io: Server) => {
    io.on('connection', (socket) => {
        socket.users = []
        socket.theCurrentQuestion = {}
        socket.on('join', async(data) => {
            jwt.verify(<string>data.jwt, <string>config.get('jwt-secret-key'), async(error, decodedToken) => {
                socket.user = decodedToken as JwtPayload
                socket.users.push(decodedToken as JwtPayload)
                addUser(decodedToken as JwtPayload)
                redis.sadd('users', data.jwt)
            })

        socket.quiz = await Quiz.findOne({title: data.quizTitle})
        await redis.set('quizTitle', JSON.stringify(data.quizTitle))
        socket.join(data.quizTitle)
        io.in(data.quizTitle).emit('join', `please wait for game to start in room: ${data.quizTitle}`)
    });

        socket.on('next-question', async(data) => {
            jwt.verify(<string>data.token, <string>config.get('jwt-secret-key'), async(err, decodedToken) => {
                if (err) {socket.emit('next-question', "error")}
                if ((decodedToken as JwtPayload)!.role! != "seyyed") {return socket.emit('next-question', "you are not seyyed")}
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
            const quizTitle = JSON.parse(await redis.get("quizTitle") || 'null');
            jwt.verify(data.token, config.get('jwt-secret-key'), async(err: any) => {
                if (err) {socket.emit('next-question', "error")}
                const redisCurrent = JSON.parse(await redis.get('current-question') || '{}');
                if (data.answer != redisCurrent.correctAnswer){
                    await redis.srem('users', data.token)
                    socket.emit('answer', 'wrong answer! you lost!')
                }                
                if (await redis.scard('users') == 3) {socket.emit('winner', "you are the winner")}
                return socket.emit('join', `please wait for next question in room: ${quizTitle}`)
            });
        });
    });
};

async function addUser(userId: JwtPayload) {
    const transaction = await redis.multi();
    transaction.sismember('users', JSON.stringify(userId));
    transaction.sadd('users', JSON.stringify(userId));
    await transaction.exec();
}

async function removeUser(userId: JwtPayload) {
    const transaction = await redis.multi();
    transaction.sismember('users', JSON.stringify(userId));
    transaction.srem('users', JSON.stringify(userId));
    await transaction.exec();
}

export { router, io };