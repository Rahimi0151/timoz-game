const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionTitle: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    answer1: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    answer2: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    answer3: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    answer4: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    correctAnswer: {
        type: Number,
        required: true,
        min: 1,
        max: 4,
    },
    difficulty: {
        type: String,
        default: 'easy',
        enum: ['easy', 'normal', 'hard', 'expert'],
        required: false,
    }
});

const quizSchema = new mongoose.Schema({
    quizNumber: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    questions: {
        type: [questionSchema],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
