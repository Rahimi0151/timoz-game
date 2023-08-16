import {describe, jest, it, expect, test, beforeEach, beforeAll, afterAll, afterEach} from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import User from '../../src/models/user';
import http from 'http'
import { serverInstance } from '../../src/index'

interface UserPayload {
    email?: string;
    password?: string;
    username?: string
}

let server: http.Server
let payload:UserPayload = {}

beforeEach(async() => {
    server = serverInstance;
    payload.email = 'validEmail@gmail.com'
    payload.password = 'validPassword'
    await User.deleteMany({})
});

afterEach(async() => {
    await server.close();
    // await User.deleteMany({})
});

describe('POST /api/users/signup', () => {

    describe('validations for password', () => {
        it('should return 400 if no password was avialable', async () => {
            payload.password = ''

            const response = await request(server).post('/api/users/signup').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('password');
        });

        it('should return 400 if password was less than 8 characters long', async () => {
            payload.password = '1234567'

            const response = await request(server).post('/api/users/signup').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('password');
        });
    });

    describe('validations for email', () => {
       
        it('should return 400 if no email was avialable', async () => {
            payload.email = ''

            const response = await request(server).post('/api/users/signup').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });

        it('should return 400 if bad email was sent', async () => {
            payload.email = 'notValidEmail.com'

            const response = await request(server).post('/api/users/signup').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });
        
        it('should return 400 if email was more than 255 characters', async () => {
            payload.email = 'a'.repeat(256) + '@gmail.com'

            const response = await request(server).post('/api/users/signup').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });
    });

    it('checks if the password has been hashed', async() => {
        // console.log('test case: 1')

        // bcrypt.hash = jest.fn().mockResolvedValue("hashed-password")
        const mockBcrypt = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

        await request(server).post('/api/users/signup').send(payload);

        expect(mockBcrypt).toHaveBeenCalledWith(payload.password, expect.anything());
        mockBcrypt.mockRestore()
    });

    it('returns 400 if email is taken', async() => {
        // console.log('test case: 3')

        await new User({
            email: payload.email,
            password: "password"
        }).save()

        const response = await request(server).post('/api/users/signup').send(payload);

        expect(response.status).toBe(400)
        expect(response.body.message).toContain("email")
    });

    
    it('returns 400 if username is taken', async() => {
        // console.log('test case: 4')
        await new User({
            email: "test@example.com",
            password: "password",
            username: "username"
        }).save()
        
        payload.username = "username"

        const response = await request(server).post('/api/users/signup').send(payload);

        expect(response.status).toBe(400)
        expect(response.body.message).toContain("username")
    });

    it('should save user to database', async() => {
        // console.log('test case: 5')
        const response = await request(server).post('/api/users/signup').send(payload);

        const userInDB = await User.findOne({email: payload.email})

        expect(userInDB!.email).toBe(payload.email)
    });

    it('should return the saved user', async() => {
        // console.log('test case: 6')
        const response = await request(server).post('/api/users/signup').send(payload);

        const userInDB = await User.findOne({email: payload.email})

        expect(response.body).toHaveProperty('email')
        expect(response.body.email).toBe(payload.email)
    });
});

describe('POST /api/users/login', () => {

    describe('validations for password', () => {
        it('should return 400 if no password was avialable', async () => {
            payload.password = ''

            const response = await request(server).post('/api/users/login').send(payload);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('password');
        });

        it('should return 400 if password was less than 8 characters long', async () => {
            payload.password = '1234567'

            const response = await request(server).post('/api/users/login').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('password');
        });
    });

    describe('validations for email', () => {
       
        it('should return 400 if no email was avialable', async () => {
            payload.email = ''

            const response = await request(server).post('/api/users/login').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });

        it('should return 400 if bad email was sent', async () => {
            payload.email = 'notValidEmail.com'

            const response = await request(server).post('/api/users/login').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });
        
        it('should return 400 if email was more than 255 characters', async () => {
            payload.email = 'a'.repeat(256) + '@gmail.com'

            const response = await request(server).post('/api/users/login').send(payload);
            expect(response.status).toBe(400);
            expect(response.body.message).toContain('email');
        });
    });

    it('should returns 400 if user doesnt exist', async() => {
        // console.log('test case: 7')
        const newUser = await new User(payload).save()
        payload.email = 'another-email@gmail.com'
        
        const response = await request(server).post('/api/users/login').send(payload);

        expect(response.status).toBe(400)
        expect(response.body.message).toContain("incorrect")
        await User.deleteMany({})
    });

    it('should send 400 if password was incorrect', async() => {
        // console.log('test case: 8')

        await new User(payload).save()
        payload.password = "anotherPassword"

        const response = await request(server).post('/api/users/login').send(payload);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('password');
    });

    it('should create jwt', async() => {
        // console.log('test case: 9')
        await request(server).post('/api/users/signup').send(payload);
        
        const response = await request(server).post('/api/users/login').send(payload);

        expect(response.status).toBe(200);
        expect(response.header['x-auth-token']).not.toBeNull()
    });
});
