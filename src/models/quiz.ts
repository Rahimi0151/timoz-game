import mongoose from 'mongoose';

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
        type: Number,
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
    active: {
        type: Boolean,
        default: false
    }
    //TODO:     add active: a field that is a boolean. its false for all the quizes in this collection
    //TODO:     but the quiz that is active at the time and will be played that night.
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz
