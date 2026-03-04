const mongoose = require('mongoose');

const managerInviteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '24h' }
    }
})

module.exports = mongoose.model('ManagerInvite', managerInviteSchema);
