
module.exports = ()=>{
    const mongoose = require('mongoose');
    const config = require('config');

    const MONGODB_URI = config.get('database-connection-string');
    mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
        // throw new Error('sdfjha;sldkfa;sldjf')

    });

}


