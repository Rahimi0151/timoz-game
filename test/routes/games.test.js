const request = require('supertest');
const Quiz = require('../../src/models/quiz')
const User = require('../../src/models/user')
const mongoose = require('mongoose')
const io = require('socket.io-client');

let server
let payload = {}
let jwt
let clientSocket

beforeAll(async() => {
    server = require('../../src/index').server;
    clientSocket = io.connect(`http://localhost:${server.address().port}`);
})
afterAll(async() => {
    clientSocket.disconnect();
    await server.close();
})
beforeEach(async() => {
    //sign up as a new user
    await signup();
    //login as the same user
    await login()

    await Quiz.deleteMany({})
});

afterEach(async() => {
});

describe('GET /api/game/', () => {

    describe('check if user is signed in', () => {
        it('should return 401 if [x-auth-token] header was not set', async () => {
            const response = await request(server).get('/api/game').send();

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('login');
        });
        
        it('should return 401 if [x-auth-token] header was not a valid token', async () => {
            jwt = 'invalid token'

            const response = await request(server).get('/api/game').set('x-auth-token', jwt).send();

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('login');
        });
    });

    describe('check if the right quiz is active', () => {
        it('return 400 if there is no quiz active', async () => {
            const response = await request(server).get('/api/game').set('x-auth-token', jwt);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('active');
        });        
        
        it('should return 200 if there is an active quiz', async () => {
            await createQuiz(active=true)
            const response = await request(server).get('/api/game').set('x-auth-token', jwt);
            
            expect(response.status).toBe(200);
            expect(mongoose.Types.ObjectId.isValid(response.body.quizId)).toBe(true);
        });        
    });

    describe('check the socket connection', () => { 
        it('should check if connected to socket', async () => {    
            await createQuiz(active=true)
            const response = await request(server).get('/api/game').set('x-auth-token', jwt);

            const joinPromise = new Promise((resolve) => {
                clientSocket.on('join', (data) => {
                    console.log(data);
                    expect(data).toContain(response.body.quizId)
                    resolve();
                });
            });

            clientSocket.emit('join', { quizId: response.body.quizId });
            
            await joinPromise;
          });
    });
});

async function login() {
    const user = await request(server)
        .post('/api/users/login')
        .send({ email: "validEmail@gmail.com", password: 'valid password' });
    jwt = user.headers['x-auth-token']

}

async function signup() {
    await request(server)
        .post('/api/users/signup')
        .send({ email: "validEmail@gmail.com", password: 'valid password' });
}

async function createQuiz(active) {
    const payload = {
        title: 'quizTitle',
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
        ],
        active: active
    }
    await request(server).post('/api/quiz').send(payload);
}
