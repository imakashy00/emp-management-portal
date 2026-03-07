const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Import the middleware
const {
  addLeaveRequest,
  getLeaveRequestsByUserId,
  deleteLeaveRequest,
  updateLeaveRequest
} = require('../controllers/leaveRequestController');

// router.post(path, middleware, controller)
router.post('/', upload.single('file'), addLeaveRequest);

// Using the same middleware for updates
router.put('/:id', upload.single('file'), updateLeaveRequest);

router.get('/:userId', getLeaveRequestsByUserId);
router.delete('/:id', deleteLeaveRequest);

module.exports = router;