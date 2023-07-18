const request = require('supertest');
const app = require('../src/index');

let server;

beforeEach(async() => {
  server = app.listen();
});

afterEach(async () => {
  await server.close();
});

describe('GET /api/start/test', () => {
  it('should return 200', async () => {
    const response = await request(app).get('/api/start/test');
    expect(response.status).toBe(200);
  });

  // Additional test cases...
});
