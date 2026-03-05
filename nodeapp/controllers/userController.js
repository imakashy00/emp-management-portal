const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites'); // Use one consistent import
const { generateToken } = require('../middleware/auth');
const sendManagerInvite = require('../services/sendMail');

/**
 * LOGIN: Find by email, then compare plaintext password using bcrypt.compare
 * Route: POST /login
 * Body: { email, password }
 */
const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find by email only
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare plaintext with the stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = generateToken(user.userName, user._id, user.role, user.email);

    // Respond without password
    return res.status(200).json({
      userName: user.userName,
      role: user.role,
      token,
      id: user._id
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * REGISTER/ADD USER: Hash password with bcrypt (10 salt rounds) before saving
 * Route: POST /users
 * Body: { userName, email, password, mobile, role? }
 */
const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobile, role } = req.body;

    // (Optional but recommended) prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password with 10 salt rounds
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      mobile,
      role: role || 'employee'
    });

    // Return safe user (no password)
    const safeUser = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    };

    return res.status(200).json({ message: 'User added Successfully', user: safeUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET all employees
 * Route: GET /employees
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    return res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * INVITE MANAGER: creates a 64-char token, persists, and emails the invite
 * Route: POST /managers/invite
 * Body: { email, _id }  // _id = inviter's user id (kept as in your original code)
 */
const inviteManager = async (req, res) => {
  const { email, _id } = req.body;

  // Create a secure 64-character token
  const token = crypto.randomBytes(32).toString('hex');

  try {
    // Save to DB (Ensure your Schema has a TTL index for 24h)
    await ManagerInvites.create({ email, token, invitedBy: _id });

    // Send the email via SendGrid
    await sendManagerInvite(email, token);

    return res.status(200).json({ message: 'Invitation sent successfully!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * VERIFY MANAGER: verifies token, creates manager (hashed), deletes invite
 * Route: POST /managers/verify
 * Body: { userName, email, mobile, password, token }
 */
const verifyManager = async (req, res) => {
  const { userName, email, mobile, password, token } = req.body;

  try {
    // Verify token
    const invite = await ManagerInvites.findOne({ email, token });
    if (!invite) {
      return res.status(403).json({ error: 'Invalid or expired manager token' });
    }

    // (Optional) prevent duplicate accounts
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash manager password with 10 salt rounds
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create manager user
    await User.create({
      userName,
      email,
      password: hashedPassword,
      mobile,
      role: 'manager'
    });

    // Delete token after successful use
    await ManagerInvites.deleteOne({ _id: invite._id });

    return res.status(201).json({ message: 'Manager account verified and created' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  verifyManager
};