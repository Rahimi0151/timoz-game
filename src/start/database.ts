import mongoose from 'mongoose';
import config from 'config';

const connectToDatabase = ()=>{
    mongoose.connect(config.get('database-connection-string'))
            .then(()=>{console.log('Connected to MongoDB');})
            .catch((error)=>{console.log('Error connecting to MongoDB:', error);});
}

export default connectToDatabase