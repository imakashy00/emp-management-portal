const mongoose = require('mongoose');
const messages = require('../errorMessages/modelError.json');

const leaveRequestSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, messages.leave.employeeId]
    },
    startDate: { type: Date, required: [true, messages.leave.startDate.required] },
    endDate: {
        type: Date,
        required: [true, messages.leave.endDate.required],
        validate: {
            validator: function(value) { return value >= this.startDate; },
            message: messages.leave.endDate.invalid
        }
    },
    reason: {
        type: String,
        required: [true, messages.leave.reason.required],
        minlength: [10, messages.leave.reason.minLength]
    },
    leaveType: {
        type: String,
        required: [true, messages.leave.leaveType.required],
        enum: {
            // MUST include 'PTO' exactly like this
            values: ['Sick Leave', 'Casual Leave', 'PTO', 'Vacation'], 
            message: "{VALUE} is not a valid leave type"
        }
    },
    status: { type: String, default: 'Pending' },
    file: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);