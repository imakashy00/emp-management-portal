const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    token: {
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 
    }
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);