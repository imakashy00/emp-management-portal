const express = require('express');
const {
  getUserByEmailAndPassword,
  getAllEmployees,
  addUser,
  inviteManager,
  checkEmail,
  resetPassword,
  getDashboardStats,
  getMe,
  updateProfile,
  getEmployeeStats,
} = require('../controllers/userController');
const { validateRole, verifyJWT } = require('../middlewares/auth');

const router = express.Router();

// Authentication
router.post('/signup', addUser);
router.post('/login', getUserByEmailAndPassword);

// Forgot Password
router.post('/check-email', checkEmail);
router.put('/reset-password', resetPassword);

//me
router.get('/me', verifyJWT, getMe);
router.put('/update-profile', verifyJWT, updateProfile);

// Employees
router.get('/getAllEmployees', verifyJWT, validateRole('manager'), getAllEmployees);

// Manager Invitations
router.post('/inviteManager', verifyJWT, validateRole('manager'), inviteManager);

router.get('/manager-stats', verifyJWT, validateRole('manager'), getDashboardStats);
router.get('/employee-stats', verifyJWT, validateRole('employee'), getEmployeeStats);

module.exports = router;




