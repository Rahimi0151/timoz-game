const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

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
    },
    points: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'moderator', 'admin', 'seyyed']
    }
});

userSchema.methods.generateJwt = function() {
    const secretKey = config.get('jwt-secret-key')
    const payload = {
        email: this.email,
        phone: this.phone,
        username: this.username
    }
    return jwt.sign(payload, secretKey);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
