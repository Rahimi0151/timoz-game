const yup = require('yup')

const create = (req, res, next)=>{
    const questionSchema = yup.object({
        questionTitle: yup.string().required('questionTitle required'),
        answer1: yup.string().required('answer1 required'),
        answer2: yup.string().required('answer2 required'),
        answer3: yup.string().required('answer3 required'),
        answer4: yup.string().required('answer4 required'),
        correctAnswer: yup.number().min(1).max(4).required('correctAnswer required'),
        difficulty: yup.string().oneOf(['easy', 'normal', 'hard', 'expert', ]),
    });

    const quizSchema = yup.object({
        quizNumber: yup.number().required('quizNumber required'),
        title: yup.string().required('title required'),
        questions: yup.array().of(questionSchema),
    });
    
    quizSchema.validate(req.body)
        .then(() => {next();})
        .catch((error)=>{res.status(400).json({message: error.message})})
}
module.exports = {
    create: create
}