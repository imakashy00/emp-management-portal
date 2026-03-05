const express = require('express');
const { getUserByEmailAndPassword, getAllEmployees, addUser, inviteManager, verifyManager } = require('../controllers/userController');

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "User added successfully" }
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName: { type: string }
 *                 role: { type: string }
 *                 token: { type: string }
 *                 id: { type: string }
 *       404:
 *         description: User not found
 */
router.post('/login', getUserByEmailAndPassword);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName: { type: string }
 *                   email: { type: string }
 *                   mobile: { type: string }
 *       400:
 *         description: Authentication failed
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