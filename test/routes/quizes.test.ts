import request from 'supertest';
import Quiz from '../../src/models/quiz';

let server
let payload = {}

beforeEach(async() => {
    server = require('../../src/index').server;
    payload = {
        title: 'first quiz',
        questions: [
            {
                questionTitle: "question 1", correctAnswer: 1,
                answer1: "answer1", answer2: "answer2", answer3: "answer3", answer4: "answer4",
            },{
                questionTitle: "question 2", correctAnswer: 1,
                answer1: "answer1", answer2: "answer2", answer3: "answer3", answer4: "answer4",
            },{
                questionTitle: "question 3", correctAnswer: 1,
                answer1: "answer1", answer2: "answer2", answer3: "answer3", answer4: "answer4",
            }
        ]
    }

    await Quiz.deleteMany({})
});

afterEach(async() => {
    await server.close();
    // await User.deleteMany({})
});

describe('POST /api/quiz/', () => {

    describe('validations for quiz', () => {
        it('should return 400 if no title was avialable', async () => {
            payload.title = ''

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('title');
        });
        
    });
    describe('validations for each question', () => {
        it('should return 400 if no question was avialable', async () => {
            payload.questions = []

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('at least 1');
        });

        it('should return 400 if a question did not have a valid title', async () => {
            payload.questions[0].questionTitle = ''

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('questionTitle');
        });

        it('should return 400 if a question did not have a valid answer1', async () => {
            payload.questions[0].answer1 = ''

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('answer1');
        });

        it('should return 400 if a question did not have a correctAnswer', async () => {
            payload.questions[0].correctAnswer = ''

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('correctAnswer');
        });

        it('should return 400 if a question\'s correctAnswer is not between 1 and 4', async () => {
            payload.questions[0].correctAnswer = 5

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('correctAnswer');
        });

        it('should return 400 if a question\'s difficulty is not valid', async () => {
            payload.questions[0].difficulty = 'some invalid difficulty'

            const response = await request(server).post('/api/quiz').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('one of the following values');
        });
        
    });
    
    it('should calculate the right quizNumber', async () => {
        //creating a quiz with quizNumber = 1 to check if the next quiz we save have quizNumber = 2
        const fakePayload = { ...payload }
        fakePayload.quizNumber = 1
        fakePayload.title = 'fake title'
        await new Quiz(fakePayload).save()

        await request(server).post('/api/quiz').send(payload);

        const quizInDB = await Quiz.findOne({title: payload.title})
        expect(quizInDB.quizNumber).toBe(2)
    });
    
    it('should save the correct quiz to the database', async () => {
        const response = await request(server).post('/api/quiz').send(payload);

        const count = await Quiz.count()
        expect(count).toBe(1)
    });

    it('should return 200 if quiz was saved successfully', async () => {
        const response = await request(server).post('/api/quiz').send(payload);

        expect(response.status).toBe(200)
    });

    it('should return the saved quiz to the user', async () => {
        const response = await request(server).post('/api/quiz').send(payload);

        expect(response.body.quizNumber).toBe(1)
        expect(response.body.title).toBe(payload.title)
        expect(response.body.questions).toHaveLength(payload.questions.length)
    });
});
