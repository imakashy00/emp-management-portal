const express = require('express');
const router = express.Router();
const {
    viewLeaves,
    getLeaveRequestById,
    addLeaveRequest,
    updateLeaveRequest,
    deleteLeaveRequest,
    changeLeaveStatus
} = require('../controllers/leaveRequestController');
const { verifyJWT } = require('../middleware/auth');
const messages = require('../errorMessages/controllerError.json');

// Helper middleware for Role-Based Access Control (RBAC)
const restrictTo = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return res.status(403).json({ message: messages.auth.forbidden });
        }
        next();
    };
};

// Protect ALL routes below this line
router.use(verifyJWT);

// Shared Routes (Both Manager and Employee can view)
router.get('/', viewLeaves);
router.get('/:id', getLeaveRequestById);

// Employee Only Routes
router.post('/', restrictTo('employee'), addLeaveRequest);
router.put('/:id', restrictTo('employee'), updateLeaveRequest);
router.delete('/:id', restrictTo('employee'), deleteLeaveRequest);

// Manager Only Routes
router.patch('/:id/status', restrictTo('manager'), changeLeaveStatus);

module.exports = router;