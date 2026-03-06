// --- routers/leaveRequestRouter.js (Complete) ---
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addLeaveRequest, getLeaveRequestsByUserId, deleteLeaveRequest, updateLeaveRequest } = require('../controllers/userController');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// The string 'file' here MUST match the payload.append('file', ...) on frontend
router.post('/addLeaveRequest', upload.single('file'), addLeaveRequest);

// Other routes
router.get('/getLeaveRequestsByUserId/:userId', getLeaveRequestsByUserId);
router.put('/updateLeaveRequest/:id', upload.single('file'), updateLeaveRequest);
router.delete('/deleteLeaveRequest/:id', deleteLeaveRequest);

module.exports = router;