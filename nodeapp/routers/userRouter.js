const express = require('express');
const { 
  getUserByEmailAndPassword, 
  getAllEmployees, 
  addUser, 
  inviteManager, 
  verifyManager, 
  checkEmail, 
  resetPassword,
  addWfhRequest,
  getWfhRequestsByUserId,
  updateWfhRequest,
  deleteWfhRequest
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

// WFH Requests (Full CRUD)
router.post('/addWfhRequest', addWfhRequest);
router.get('/getWfhRequestsByUserId/:userId', getWfhRequestsByUserId);
router.put('/updateWfhRequest/:id', updateWfhRequest);    // Added for Edit
router.delete('/deleteWfhRequest/:id', deleteWfhRequest); // Added for Delete

// Manager Invitations
router.post('/inviteManager', inviteManager);
router.post('/verifyManager', verifyManager);

module.exports = router;