const express = require('express');
const router = express.Router();
const leaveRequest = require('../controllers/leaveRequestController');
// const { generateToken, verifyJWT } = require('../middleware/auth');

// router.use(generateToken);

// Shared View Routes
router.get('/', leaveRequest.viewLeaves);
router.get('/:id', leaveRequest.getLeaveRequestById);

// Employee Only Routes
router.post('/',  leaveRequest.addLeaveRequest);
router.put('/:id',  leaveRequest.updateLeaveRequest);
router.delete('/:id',  leaveRequest.deleteLeaveRequest);

// Manager Only Routes
router.patch('/:id/status', leaveRequest.changeLeaveStatus);

module.exports = router;