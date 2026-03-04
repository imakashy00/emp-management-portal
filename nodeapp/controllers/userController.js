const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt=require('bcrypt')
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middleware/auth');
const sendManagerInvite = require('../services/sendEmail');
const managerInvites = require('../models/managerInvites');

const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken(user.userName, user._id, user.role, user.email);
    res.status(200).json({
      userName: user.userName,
      role: user.role,
      token: token,
      id: user._id
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });

  }
};

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ message: "User added Successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllEmployees = async (req, res) => {

  try {
    const employees = await User.find({ role: 'employee' });
    res.status(200).json(employees);
  } catch (error) {
    console.log(error)

  }

}

const inviteManager = async (req, res) => {
  const { email, _id } = req.body;

  // Create a secure 64-character token
  const token = crypto.randomBytes(32).toString('hex');

  try {
    // Save to DB (Ensure your Schema has a TTL index for 24h)
    await ManagerInvites.create({ email, token, invitedBy: _id });

    // Send the email via SendGrid
    await sendManagerInvite(email, token);

    res.status(200).json({ message: "Invitation sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyManager=async (req, res) => {
  const { userName, email,mobile, password, token } = req.body;

  // STEP: Token Verification Logic
  const invite = await managerInvites.findOne({ email, token });
  
  if (!invite) {
      return res.status(403).json({ error: "Invalid or expired manager token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ userName, email, password: hashedPassword, mobile, role: 'manager' });

  // Delete token after successful use (One-time use only)
  await ManagerInvites.deleteOne({ _id: invite._id });

  res.status(201).json({ message: "Manager account verified and created" });
};



module.exports = { getUserByEmailAndPassword, addUser, getAllEmployees, inviteManager,verifyManager };