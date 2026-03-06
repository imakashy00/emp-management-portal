const User = require('../models/userModel');
const WfhRequest = require('../models/wfhRequestModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middleware/auth');
const sendManagerInvite = require('../services/sendMail');
const messages = require('../errorMessages/controllerError.json');

// --- AUTHENTICATION ---
const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: messages.auth.invalid });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: messages.auth.invalid });

    const token = generateToken(user.userName, user._id, user.role, user.email);
    return res.status(200).json({ userName: user.userName, role: user.role, token, id: user._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobile, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: messages.user.exists });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ userName, email: email.toLowerCase(), password: hashedPassword, mobile, role: role || 'employee' });
    return res.status(200).json({ message: messages.user.addSuccess });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- FORGOT PASSWORD ---
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
    await User.findOneAndUpdate({ email: email.trim().toLowerCase() }, { password: hashedPassword });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- WFH REQUESTS ---
const addWfhRequest = async (req, res) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;
    const newRequest = await WfhRequest.create({
      employeeId: userId,
      startDate,
      endDate,
      reason,
      status: 'Pending'
    });
    return res.status(200).json({ message: "WFH Request added Successfully", data: newRequest });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getWfhRequestsByUserId = async (req, res) => {
  try {
    const requests = await WfhRequest.find({ employeeId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// NEW: Update WFH Request
// --- Updated Update Logic (Ref: Fixed Validation Context) ---
const updateWfhRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // 1. Find the existing document first
    const request = await WfhRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2. Manually update the fields
    // This allows the Model Validator to see both dates at once
    request.startDate = startDate;
    request.endDate = endDate;
    request.reason = reason;

    // 3. Save the document (This triggers the Schema validators properly)
    await request.save();

    return res.status(200).json({
      message: "WFH Request updated successfully",
      data: request
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    // Return the specific validation message from your modelError.json
    return res.status(400).json({ message: error.message });
  }
};

// NEW: Delete WFH Request
const deleteWfhRequest = async (req, res) => {
  try {
    const deleted = await WfhRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    return res.status(200).json({ message: "WFH Request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- MANAGER ACTIONS ---
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ message: messages.user.fetchError });
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
      // This logic finds which field caused the duplicate error (userName or email)
      const duplicateField = Object.keys(err.keyValue)[0];

      return res.status(400).json({
        message: `The ${duplicateField} "${err.keyValue[duplicateField]}" is already taken. Please try another.`
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

const verifyManager = async (req, res) => {
  try {
    const { userName, email, mobile, password, token } = req.body;
    const invite = await ManagerInvites.findOne({ email, token });
    if (!invite) return res.status(403).json({ error: messages.auth.tokenExpired });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ userName, email, password: hashedPassword, mobile, role: 'manager' });
    await ManagerInvites.deleteOne({ _id: invite._id });
    return res.status(201).json({ message: messages.manager.verifySuccess });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  verifyManager,
  checkEmail,
  resetPassword,
  addWfhRequest,
  getWfhRequestsByUserId,
  updateWfhRequest,
  deleteWfhRequest
};