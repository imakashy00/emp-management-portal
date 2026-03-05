const express = require('express');
// Added 'checkEmail' and 'resetPassword' to the imports
const { 
  getUserByEmailAndPassword, 
  getAllEmployees, 
  addUser, 
  inviteManager, 
  verifyManager,
  checkEmail,     // New Controller function
  resetPassword   // New Controller function
} = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Authentication and User management
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new Employee or Manager
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, mobile, password, role]
 *             properties:
 *               userName: { type: string, example: "john_doe" }
 *               email: { type: string, example: "john@workbuddy.com" }
 *               mobile: { type: string, example: "9876543210" }
 *               password: { type: string, example: "password123" }
 *               role: { type: string, example: "Employee" }
 *     responses:
 *       200:
 *         description: User Registration Successful
 */
router.post('/signup', addUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "employee1@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Returns JWT Token and User Info
 */
router.post('/login', getUserByEmailAndPassword);

/**
 * @swagger
 * /api/users/check-email:
 *   post:
 *     summary: Verify if an email exists in the database (Step 1 of Forgot Password)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "employee1@example.com" }
 *     responses:
 *       200:
 *         description: Email found and verified
 *       404:
 *         description: Email not found
 */
router.post('/check-email', checkEmail);

/**
 * @swagger
 * /api/users/reset-password:
 *   put:
 *     summary: Update password directly (Step 2 of Forgot Password)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newPassword]
 *             properties:
 *               email: { type: string, example: "employee1@example.com" }
 *               newPassword: { type: string, example: "newsecurepass123" }
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       500:
 *         description: Server error
 */
router.put('/reset-password', resetPassword);

/**
 * @swagger
 * /api/users/getAllEmployees:
 *   get:
 *     summary: Retrieve a list of all Employees (Protected Route)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of employees
 */
router.get('/getAllEmployees', getAllEmployees);

/**
 * @swagger
 * /api/users/inviteManager:
 *   post:
 *     summary: Send invitation to a new Manager
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "manager@company.com" }
 *     responses:
 *       200:
 *         description: Invitation sent
 */
router.post('/inviteManager', inviteManager);

/**
 * @swagger
 * /api/users/verifyManager:
 *   post:
 *     summary: Verify Manager Token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Token verified successfully
 */
router.post('/verifyManager', verifyManager);

module.exports = router;