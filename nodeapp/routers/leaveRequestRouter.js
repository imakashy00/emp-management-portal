const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  addLeaveRequest,
  getLeaveRequestsByUserId,
  deleteLeaveRequest,
  updateLeaveRequest
} = require('../controllers/leaveRequestController');

// Standardized routes
router.post('/', upload.single('file'), addLeaveRequest);

// FIXED: Variable name must match req.params.employeeId in controller
router.get('/:employeeId', getLeaveRequestsByUserId); 

router.put('/:id', upload.single('file'), updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

module.exports = router;