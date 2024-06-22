const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    notes: {
        type: String,
        required: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;