const express = require('express');
const router = express.Router();
const validateQuiz = require('../middleware/validate/quiz')
const Quiz = require('../models/quiz')

router.post('/', validateQuiz.create, async(req, res) => {
    const countQuizInDB = await Quiz.count()
    req.body.quizNumber = countQuizInDB+1

    const quiz = await new Quiz(req.body).save()
    
    res.status(200).json(quiz);
});

module.exports = router;
