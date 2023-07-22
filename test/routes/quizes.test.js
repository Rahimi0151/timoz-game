const request = require('supertest');
const Quiz = require('../../src/models/quiz')

let server
let payload = {}

beforeEach(async() => {
    server = require('../../src/index');
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

    
        

//     describe('validations for email', () => {
       
//         it('should return 400 if no email was avialable', async () => {
//             payload.email = ''

//             const response = await request(server).post('/api/users/signup').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });

//         it('should return 400 if bad email was sent', async () => {
//             payload.email = 'notValidEmail.com'

//             const response = await request(server).post('/api/users/signup').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });
        
//         it('should return 400 if email was more than 255 characters', async () => {
//             payload.email = 'a'.repeat(256) + '@gmail.com'

//             const response = await request(server).post('/api/users/signup').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });
//     });

//     it('checks if the password has been hashed', async() => {
//         // console.log('test case: 1')

//         // bcrypt.hash = jest.fn().mockResolvedValue("hashed-password")
//         const mockBcrypt = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');

//         await request(server).post('/api/users/signup').send(payload);

//         expect(mockBcrypt).toHaveBeenCalledWith(payload.password, expect.anything());
//         mockBcrypt.mockRestore()
//     });

//     it('returns 400 if email is taken', async() => {
//         // console.log('test case: 3')

//         await new User({
//             email: payload.email,
//             password: "password"
//         }).save()

//         const response = await request(server).post('/api/users/signup').send(payload);

//         expect(response.status).toBe(400)
//         expect(response.body.message).toContain("email")
//     });

    
//     it('returns 400 if username is taken', async() => {
//         // console.log('test case: 4')
//         await new User({
//             email: "test@example.com",
//             password: "password",
//             username: "username"
//         }).save()
        
//         payload.username = "username"

//         const response = await request(server).post('/api/users/signup').send(payload);

//         expect(response.status).toBe(400)
//         expect(response.body.message).toContain("username")
//     });

//     it('should save user to database', async() => {
//         // console.log('test case: 5')
//         const response = await request(server).post('/api/users/signup').send(payload);

//         const userInDB = await User.findOne({email: payload.email})

//         expect(userInDB.email).toBe(payload.email)
//     });

//     it('should return the saved user', async() => {
//         // console.log('test case: 6')
//         const response = await request(server).post('/api/users/signup').send(payload);

//         const userInDB = await User.findOne({email: payload.email})

//         expect(response.body).toHaveProperty('email')
//         expect(response.body.email).toBe(payload.email)
//     });
// });

// describe('POST /api/users/login', () => {

//     describe('validations for password', () => {
//         it('should return 400 if no password was avialable', async () => {
//             payload.password = ''

//             const response = await request(server).post('/api/users/login').send(payload);

//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('password');
//         });

//         it('should return 400 if password was less than 8 characters long', async () => {
//             payload.password = '1234567'

//             const response = await request(server).post('/api/users/login').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('password');
//         });
//     });

//     describe('validations for email', () => {
       
//         it('should return 400 if no email was avialable', async () => {
//             payload.email = ''

//             const response = await request(server).post('/api/users/login').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });

//         it('should return 400 if bad email was sent', async () => {
//             payload.email = 'notValidEmail.com'

//             const response = await request(server).post('/api/users/login').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });
        
//         it('should return 400 if email was more than 255 characters', async () => {
//             payload.email = 'a'.repeat(256) + '@gmail.com'

//             const response = await request(server).post('/api/users/login').send(payload);
//             expect(response.status).toBe(400);
//             expect(response.body.message).toContain('email');
//         });
//     });

//     it('should returns 400 if user doesnt exist', async() => {
//         // console.log('test case: 7')
//         const newUser = await new User(payload).save()
//         payload.email = 'another-email@gmail.com'
        
//         const response = await request(server).post('/api/users/login').send(payload);

//         expect(response.status).toBe(400)
//         expect(response.body.message).toContain("incorrect")
//         await User.deleteMany({})
//     });

//     it('should send 400 if password was incorrect', async() => {
//         // console.log('test case: 8')

//         await new User(payload).save()
//         payload.password = "anotherPassword"

//         const response = await request(server).post('/api/users/login').send(payload);

//         expect(response.status).toBe(400);
//         expect(response.body.message).toContain('password');
//     });

//     it('should create jwt', async() => {
//         // console.log('test case: 9')
//         await request(server).post('/api/users/signup').send(payload);
        
//         const response = await request(server).post('/api/users/login').send(payload);

//         expect(response.status).toBe(200);
//         expect(response.header['x-auth-token']).not.toBeNull()
//     });
});
