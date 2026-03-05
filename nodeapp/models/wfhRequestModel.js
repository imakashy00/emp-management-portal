const mongoose = require('mongoose');
const messages = require('../errorMessages/modelError.json');

const wfhRequestSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, messages.wfh.employeeId] 
  },
  startDate: { 
    type: Date, 
    required: [true, messages.wfh.startDate.required] 
  },
  endDate: { 
    type: Date, 
    required: [true, messages.wfh.endDate.required],
    validate: {
      validator: function(value) { return value >= this.startDate; },
      message: messages.wfh.endDate.invalid
    }
  },
  reason: { 
    type: String, 
    required: [true, messages.wfh.reason.required],
    minlength: [10, messages.wfh.reason.minLength]
  },
  status: { 
    type: String, 
    enum: {
      values: ['Pending', 'Approved', 'Rejected'],
      message: messages.wfh.status.enum
    },
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('WfhRequest', wfhRequestSchema);