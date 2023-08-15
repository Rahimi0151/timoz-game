import mongoose from 'mongoose';
import config from 'config';
import connectToDatabase from '../../src/start/database';

describe('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
      
    mongoose.connect = jest.fn().mockResolvedValue(true);
    console.log = jest.fn();
    const MONGODB_URI = config.get('database-connection-string');
      
    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle database connection error', async () => {
    const error = new Error('Connection error');

    mongoose.connect = jest.fn().mockRejectedValue(error);
    console.log = jest.fn();

    await connectToDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

//   expect(console.log).toHaveBeenCalled();
  });
});