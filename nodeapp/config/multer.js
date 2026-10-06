const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs'); // Added File System module
const path = require('path');
const { addLeaveRequest, getLeaveRequestsByUserId, deleteLeaveRequest, updateLeaveRequest } = require('../controllers/userController');

// --- auto create uploads folders ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Created 'uploads' directory automatically.");
}

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir + '/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Route Definitions
router.post('/addLeaveRequest', upload.single('file'), addLeaveRequest);
router.get('/getLeaveRequestsByUserId/:userId', getLeaveRequestsByUserId);
router.put('/updateLeaveRequest/:id', upload.single('file'), updateLeaveRequest);
router.delete('/deleteLeaveRequest/:id', deleteLeaveRequest);

module.exports = router;