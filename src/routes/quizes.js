const express = require('express');
const router = express.Router();
const validateQuiz = require('../middleware/validate/quiz')

router.post('/signup', validateQuiz.create, async(req, res) => {
    res.status(200).json({});
});

module.exports = router;
