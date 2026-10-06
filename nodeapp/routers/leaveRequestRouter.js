const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  addLeaveRequest,
  getLeaveRequestsByUserId,
  deleteLeaveRequest,
  updateLeaveRequest,
  getManagerLeaveRequests, // Import new
  changeLeaveStatus
} = require('../controllers/leaveRequestController');
const { verifyJWT, validateRole } = require('../middlewares/auth');
router.use(verifyJWT);

router.get('/', validateRole('manager'), getManagerLeaveRequests);

// MANAGER: Update Status
router.patch('/:id/status', validateRole('manager'), changeLeaveStatus);

// Standardized routes
router.post('/', upload.handleUpload('file'), addLeaveRequest);

router.get('/:employeeId', getLeaveRequestsByUserId);

router.put('/:id', upload.handleUpload('file'), updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

module.exports = router;