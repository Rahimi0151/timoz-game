import express from 'express';
const router = express.Router();
import { create } from '../middleware/validate/quiz';
import Quiz from '../models/quiz';

router.post('/', create, async(req, res) => {
    const countQuizInDB = await Quiz.count()
    req.body.quizNumber = countQuizInDB+1

    const quiz = await new Quiz(req.body).save()
    
    res.status(200).json(quiz);
});

export default router