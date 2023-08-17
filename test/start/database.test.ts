import {describe, it, jest, expect, test, beforeEach, beforeAll, afterAll, afterEach} from '@jest/globals';

import mongoose from 'mongoose';
import config from 'config';
import connectToDatabase from '../../src/start/database';

describe('Database Connection', () => {
    it('should connect to MongoDB successfully', async () => {
        
        jest.spyOn(mongoose, 'connect').mockResolvedValue(true as never);
        console.log = jest.fn();
        const MONGODB_URI = config.get('database-connection-string');
        
        await connectToDatabase();

        expect(mongoose.connect).toHaveBeenCalledWith(MONGODB_URI);
        expect(console.log).toHaveBeenCalled();
    });

    it('should handle database connection error', async () => {
        const error = new Error('Connection error');

        jest.spyOn(mongoose, 'connect').mockResolvedValue(error as never);
        console.log = jest.fn();

        await connectToDatabase();

        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));

    });
});