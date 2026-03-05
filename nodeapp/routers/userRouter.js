const express = require('express');
const { 
  getUserByEmailAndPassword, 
  getAllEmployees, 
  addUser, 
  inviteManager, 
  verifyManager, 
  checkEmail, 
  resetPassword 
} = require('../controllers/userController');

const router = express.Router();

// Pure logic, no more long documentation comments!
router.post('/signup', addUser);
router.post('/login', getUserByEmailAndPassword);
router.post('/check-email', checkEmail);
router.put('/reset-password', resetPassword);
router.get('/getAllEmployees', getAllEmployees);
router.post('/inviteManager', inviteManager);
router.post('/verifyManager', verifyManager);

module.exports = router;