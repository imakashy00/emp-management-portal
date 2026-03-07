const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middlewares/auth');
const sendManagerInvite = require('../services/sendMail');
const messages = require('../errorMessages/controllerError.json');

const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: messages.auth.invalid });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: messages.auth.invalid });

    const token = generateToken(user.userName, user._id, user.role, user.email);
    return res.status(200).json({ 
      userName: user.userName, 
      role: user.role, 
      token, 
      id: user._id 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobile, role, token } = req.body;
    const normalizedEmail = email.toLowerCase();

    let assignedRole = role || 'employee';
    let inviteRecord = null;

    // 1. Logic for Manager Invite (if token is provided)
    if (token) {
      inviteRecord = await ManagerInvites.findOne({ email: normalizedEmail, token });
      if (!inviteRecord) {
        return res.status(403).json({ message: messages.auth.tokenExpired });
      }
      assignedRole = 'manager'; // Force role to manager if using a token
    }
    // 2. Logic for Standard User (if no token)
    else {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ message: messages.user.exists });
      }
    }

    // 3. Common Logic: Hash password and Create User
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      role: assignedRole
    });

    // 4. Cleanup: If it was a manager invite, delete the token
    if (inviteRecord) {
      await ManagerInvites.deleteOne({ _id: inviteRecord._id });
      return res.status(201).json({ message: messages.manager.verifySuccess });
    }

    return res.status(200).json({ message: messages.user.addSuccess });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =========================================================
// 2. FORGOT PASSWORD (STEP 1 & 2)
// =========================================================

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: "Email not found in our records" });
    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() }, 
      { password: hashedPassword }
    );
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const inviteManager = async (req, res) => {
  try {
    const { email, _id } = req.body;
    const token = crypto.randomBytes(32).toString('hex');
    await ManagerInvites.create({ email, token, invitedBy: _id });
    await sendManagerInvite(email, token);
    return res.status(200).json({ message: messages.manager.inviteSuccess });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `The ${duplicateField} is already taken.` });
    }
    return res.status(500).json({ error: err.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: messages.user.fetchError });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  checkEmail,
  resetPassword,
};