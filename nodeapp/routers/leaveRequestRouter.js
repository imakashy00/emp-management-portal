const express = require('express');
const router = express.Router();
const leaveRequest = require('../controllers/leaveController');
const { generateToken, verifyJWT } = require('../middleware/auth');

router.use(generateToken);

// Shared View Routes
router.get('/', leaveRequest.viewLeaves);
router.get('/:id', leaveRequest.getLeaveRequestById);

// Employee Only Routes
router.post('/', verifyJWT('employee'), leaveRequest.addLeaveRequest);
router.put('/:id', verifyJWT('employee'), leaveRequest.updateLeaveRequest);
router.delete('/:id', verifyJWT('employee'), leaveRequest.deleteLeaveRequest);

// Manager Only Routes
router.patch('/:id/status', verifyJWT('manager'), leaveRequest.changeLeaveStatus);

module.exports = router;