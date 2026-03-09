const mongoose = require('mongoose');
const errorMessages = require('../errorMessages/modelError.json')

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, errorMessages.user.username.required],
    unique: true,
    minlength: [3, errorMessages.user.username.minLength],
    trim: true
  },
  email: {
    type: String,
    required: [true, errorMessages.user.email.required],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, errorMessages.user.email.invalid]
  },
  mobile: {
    type: String,
    required: [true, errorMessages.user.mobile.required],
    unique: true,
    match: [/^\d{10}$/, errorMessages.user.mobile.invalid]
  },
  password: {
    type: String,
    required: [true, errorMessages.user.password.required],
    minlength: [8, errorMessages.user.password.minLength]
  },
  role: {
    type: String,
    required: true,
    enum: ["manager", "employee"],
    default: "employee"
  },
  leaves: {
    type: Number,
    // Set default only for employees; though technically shared, 
    // the controller logic now prevents managers from using it.
    default: function () {
      return this.role === 'employee' ? 25 : 0;
    }
  }
});

module.exports = mongoose.model('User', userSchema);