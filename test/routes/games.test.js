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
})
afterAll(async() => {
    await server.close();
})
beforeEach(async() => {
    clientSocket = io.connect(`http://localhost:${server.address().port}`);
    //sign up as a new user
    await signup();
    //login as the same user
    await login()
    
    await Quiz.deleteMany({})
    await User.deleteMany({})
});

afterEach(async() => {
    await clientSocket.disconnect();
    await Quiz.deleteMany({})
    await User.deleteMany({})
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
            expect(response.body.quizTitle).toContain("quizTitle");
        });        
    });

    describe('check the socket connection', () => { 
        it('should join the user in the selected game', async () => {    
            const quizTitle = (await createQuiz(active=true)).body.title
            const response = await request(server).get('/api/game').set('x-auth-token', jwt);

            const joinPromise = new Promise((resolve) => {
                clientSocket.on('join', (data) => {
                    expect(data).toContain(quizTitle)
                    resolve();
                });
            });

            clientSocket.emit('join', { quizTitle, jwt });
            
            await joinPromise;
        });

        it('shouldnt let anyone but seyyed to send a next quesion request', async () => {    
            const quizTitle = (await createQuiz(active=true)).body.title
            
            clientSocket.emit('join', { quizTitle, jwt });
            await new Promise((resolve) => {
                clientSocket.on('join', (data) => {
                    expect(data).toContain(quizTitle)
                    expect(data).toContain("please wait")
                    resolve();
                });
            });

            clientSocket.emit('next-question', {token: jwt});
            await new Promise((resolve) => {
                clientSocket.on('next-question', (data) => {
                    expect(data).toContain('not')
                    expect(data).toContain('seyyed')
                    resolve();
                });
            });

        });

        it('should send the first question when seyyed sends his jwt to the socket', async () => {    
            const quizTitle = (await createQuiz(active=true)).body.title
            await signupAsAdmin()
            await login()

            clientSocket.emit('join', { quizTitle, jwt });
            await new Promise((resolve) => {
                clientSocket.on('join', () => {resolve()});
            });

            clientSocket.emit('next-question', {token: jwt});
            await new Promise((resolve) => {
                clientSocket.on('next-question', (data) => {
                    expect(data).toHaveProperty("questionTitle")
                    expect(data.questionTitle).toContain('question 1')
                    resolve();
                });
            });
        });

        it('should not send the correct answer to the users!', async () => {    
            const quizTitle = (await createQuiz(active=true)).body.title
            await signupAsAdmin()
            await login()

            clientSocket.emit('join', { quizTitle, jwt });
            await new Promise((resolve) => {
                clientSocket.on('join', () => {resolve()});
            });

            clientSocket.emit('next-question', {token: jwt});
            await new Promise((resolve) => {
                clientSocket.on('next-question', (data) => {
                    expect(data).not.toHaveProperty("correctAnswer")
                    expect(data).toHaveProperty("questionTitle")
                    expect(data.questionTitle).toContain('question 1')
                    resolve();
                });
            });
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

async function signupAsAdmin() {
    await User.deleteMany({})
    const user = await request(server)
        .post('/api/users/signup')
        .send({ email: "validEmail@gmail.com", password: 'valid password' });
    await User.findOneAndUpdate({ _id: user.body._id }, { role: 'seyyed' })
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
    return await request(server).post('/api/quiz').send(payload);
}
