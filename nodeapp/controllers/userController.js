const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites'); 
const { generateToken } = require('../middleware/auth');
const sendManagerInvite = require('../services/sendMail');
const messages = require('../errorMessages/controllerError.json')

/**
 * LOGIN
 */
const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() }); // Robust check
    if (!user) {
      return res.status(404).json({ message: messages.auth.invalid });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: messages.auth.invalid });
    }
    const token = generateToken(user.userName, user._id, user.role, user.email);
    return res.status(200).json({
      userName: user.userName,
      role: user.role,
      token,
      id: user._id
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message || messages.common.serverError });
  }
};

/**
 * FORGOT PASSWORD STEP 1: Verify if email exists
 */
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    // DEBUG LOG: See what the server receives
    console.log("--- Forgot Password Verification ---");
    console.log("Received Email from Frontend:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Use trim and lowercase to ensure a perfect match with DB
    const processedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: processedEmail });

    if (!user) {
      console.log("Result: Email NOT found in Database");
      return res.status(404).json({ message: "Email not found in our records" });
    }

    console.log("Result: User Found! Name is:", user.userName);
    return res.status(200).json({ message: "Email verified" });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ message: "Server error during verification" });
  }
};

/**
 * FORGOT PASSWORD STEP 2: Update password directly
 */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    console.log("--- Resetting Password for:", email, "---");

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Password updated successfully for:", user.userName);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Error:", error);
    return res.status(500).json({ message: "Server error during password reset" });
  }
};

/**
 * REGISTER/ADD USER
 */
const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobile, role } = req.body;
    
    // Store emails in lowercase for consistency
    const processedEmail = email.trim().toLowerCase();
    
    const existing = await User.findOne({ email: processedEmail });
    if (existing) {
      return res.status(409).json({ message: messages.user.exists });
    }
    
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = await User.create({
      userName,
      email: processedEmail,
      password: hashedPassword,
      mobile,
      role: role || 'employee'
    });

    // Return safe user (no password)
   
    return res.status(200).json({
      message: messages.user.addSuccess,
    
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || messages.common.serverError });
  }
};

/**
 * REST OF YOUR FUNCTIONS (GET ALL EMPLOYEES, INVITE, VERIFY)
 * Keep them as they are...
 */
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    return res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: messages.user.fetchError});
  }
};

const inviteManager = async (req, res) => {
  const { email, _id } = req.body;
  const token = crypto.randomBytes(32).toString('hex');
  try {
    await ManagerInvites.create({ email, token, invitedBy: _id });
    await sendManagerInvite(email, token);

    return res.status(200).json({ message: messages.manager.inviteSuccess });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || messages.common.serverError });
  }
};

const verifyManager = async (req, res) => {
  const { userName, email, mobile, password, token } = req.body;
  try {
    const invite = await ManagerInvites.findOne({ email, token });
    if (!invite) {
      return res.status(403).json({error: messages.auth.tokenExpired});
    }

    // (Optional) prevent duplicate accounts
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({message: messages.user.exists  });
    }

    // Hash manager password with 10 salt rounds
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({ userName, email, password: hashedPassword, mobile, role: 'manager' });
    await ManagerInvites.deleteOne({ _id: invite._id });

    return res.status(201).json({ message: messages.manager.verifySuccess });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message || messages.common.serverError });
  }
};

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  verifyManager,
  checkEmail,     
  resetPassword   
};