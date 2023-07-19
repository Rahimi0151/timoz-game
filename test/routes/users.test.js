const request = require('supertest');

let server
let payload = {}

beforeEach(() => {
    server = require('../../src/index');
    payload.email = 'validEmail@gmail.com'
    payload.password = 'validPassword'
});

afterEach(async() => {
    await server.close();
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
    
});
