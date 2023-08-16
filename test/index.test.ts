import {describe, it, expect, test, beforeEach, beforeAll, afterAll, afterEach} from '@jest/globals';
import request from 'supertest';
import http from 'http'
import { serverInstance } from '../src/index'

let server: http.Server

beforeEach(() => {
    server = serverInstance
});

afterEach(async() => {
    server.close();
});

describe('GET /api/start/test', () => {
    it('should return 200', async () => {
        const response = await request(server).get('/api/start/test');
        expect(response.status).toBe(200);
    });
});
