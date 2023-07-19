const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
        minLength: 1,
        maxLength: 255,
    },
    email: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1024,
    },
    firstName: {
        type: String,
        required: false,
        minLength: 1,
        maxLength: 255,
    },
    lastName: {
        type: String,
        required: false,
        minLength: 1,
        maxLength: 255,
    },
    phone: {
        type: String,
        required: false,
        minLength: 1,
        maxLength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
