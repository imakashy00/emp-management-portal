const express = require('express');
const {
  getUserByEmailAndPassword,
  getAllEmployees,
  addUser,
  inviteManager,
  checkEmail,
  resetPassword,
} = require('../controllers/userController');

const router = express.Router();

// Authentication
router.post('/signup', addUser);
router.post('/login', getUserByEmailAndPassword);

// Forgot Password
router.post('/check-email', checkEmail);
router.put('/reset-password', resetPassword);

// Employees
router.get('/getAllEmployees', getAllEmployees);
router.get('/employees', getAllEmployees);
router.delete('/employees/:id', deleteUser); 

// Manager Invitations
router.post('/inviteManager', inviteManager);

module.exports = router;




