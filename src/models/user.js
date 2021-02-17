const mongoose = require('mongoose')


const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true
    },
    bio: String,
    avatar: String,
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date()
    }
});

module.exports = User;