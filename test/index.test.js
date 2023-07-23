const request = require('supertest');
let server 

beforeEach(() => {
    server = require('../src/index').server;
});

afterEach(async() => {
    await server.close();
});

describe('GET /api/start/test', () => {
    it('should return 200', async () => {
        const response = await request(server).get('/api/start/test');
        expect(response.status).toBe(200);
    });
});
