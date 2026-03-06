const User = require('../models/userModel');
const WfhRequest = require('../models/wfhRequestModel');
const LeaveRequest = require('../models/leaveRequestModel'); // Added Leave Model
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middleware/auth');
const sendManagerInvite = require('../services/sendMail');
const messages = require('../errorMessages/controllerError.json');

// =========================================================
// 1. AUTHENTICATION & USER MANAGEMENT
// =========================================================

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
    const { userName, email, password, mobile, role } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: messages.user.exists });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ 
      userName, 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      mobile, 
      role: role || 'employee' 
    });
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

// =========================================================
// 3. WFH REQUESTS (CRUD)
// =========================================================

const addWfhRequest = async (req, res) => {
  try {
    const { userId, employeeId, startDate, endDate, reason } = req.body;
    const finalId = employeeId || userId;

    if (!finalId) return res.status(400).json({ message: "Employee ID is required" });

    const newRequest = await WfhRequest.create({
      employeeId: finalId, 
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

const updateWfhRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const request = await WfhRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Pattern: Manual update + save to ensure Schema validation (endDate >= startDate)
    request.startDate = startDate;
    request.endDate = endDate;
    request.reason = reason;

    await request.save();
    return res.status(200).json({ message: "WFH Request updated successfully", data: request });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteWfhRequest = async (req, res) => {
  try {
    const deleted = await WfhRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    return res.status(200).json({ message: "WFH Request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =========================================================
// 4. LEAVE REQUESTS (CRUD with File Handling)
// =========================================================

// --- controllers/userController.js (Complete addLeaveRequest function) ---

const addLeaveRequest = async (req, res) => {
  try {
    // Debug: Check what the backend is actually receiving
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { employeeId, userId, startDate, endDate, reason, leaveType } = req.body;
    
    // Safety check: Use whichever ID is provided
    const finalId = employeeId || userId;

    if (!finalId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // File name from Multer
    const fileName = req.file ? req.file.filename : null;

    const newLeave = await LeaveRequest.create({
      employeeId: finalId,
      startDate,
      endDate,
      reason,
      leaveType,
      file: fileName,
      status: 'Pending'
    });

    return res.status(200).json({ 
      message: "Leave Request added Successfully", 
      data: newLeave 
    });
  } catch (error) {
    console.error("Mongoose Error:", error.message);
    return res.status(400).json({ message: error.message });
  }
};

const getLeaveRequestsByUserId = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ employeeId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason, leaveType } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);
    
    if (!leave) return res.status(404).json({ message: "Leave Request not found" });

    leave.startDate = startDate;
    leave.endDate = endDate;
    leave.reason = reason;
    leave.leaveType = leaveType;
    
    // If a new file is uploaded during edit, update the reference
    if (req.file) leave.file = req.file.filename;

    await leave.save();
    return res.status(200).json({ message: "Leave Request updated successfully", data: leave });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const deleted = await LeaveRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Leave Request not found" });
    return res.status(200).json({ message: "Leave Request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =========================================================
// 5. MANAGER ACTIONS
// =========================================================

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
      const duplicateField = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `The ${duplicateField} is already taken.` });
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
    await User.create({ 
      userName, 
      email, 
      password: hashedPassword, 
      mobile, 
      role: 'manager' 
    });
    await ManagerInvites.deleteOne({ _id: invite._id });
    return res.status(201).json({ message: messages.manager.verifySuccess });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
  verifyManager,
  checkEmail,
  resetPassword,
  addWfhRequest,
  getWfhRequestsByUserId,
  updateWfhRequest,
  deleteWfhRequest,
  addLeaveRequest,
  getLeaveRequestsByUserId,
  updateLeaveRequest,
  deleteLeaveRequest
};