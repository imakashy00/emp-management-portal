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
    type: String // This will store the secure hex token after OTP is verified
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // This record will automatically delete itself after 10 minutes (600 seconds)
  }
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);