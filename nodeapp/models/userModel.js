const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  mobile: { type: String, required: true },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String, required: true, enum: ["manager", "employee"],
    default: "employee"
  }
});

module.exports = mongoose.model('User', userSchema);