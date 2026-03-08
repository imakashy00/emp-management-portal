const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middlewares/auth');
const sendManagerInvite = require('../services/sendMail');

const LeaveRequest = require("../models/leaveRequestModel");
const WfhRequest = require("../models/wfhRequestModel");
// Import both error message files
const messages = require('../errorMessages/controllerError.json');
const modelMessages = require('../errorMessages/modelError.json');

const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: messages.auth.invalid });
    }

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

    return res.status(500).json({ message: messages.common.serverError });

  }
};

const addUser = async (req, res) => {
  try {
    const { userName, email, password, mobile, token } = req.body;
    const normalizedEmail = email.toLowerCase();

    // --- MANUAL PASSWORD VALIDATION (Crucial for Bcrypt) ---
    if (!password) {
      return res.status(400).json({ message: modelMessages.user.password.required });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: modelMessages.user.password.minLength });
    }

    let inviteRecord = null;

    if (token) {
      inviteRecord = await ManagerInvites.findOne({ email: normalizedEmail, token });
      if (!inviteRecord) {
        return res.status(403).json({ message: messages.auth.tokenExpired });
      }
      role = 'manager';
    } else {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ message: messages.user.exists });
      }
    }

    // Hash only AFTER validation
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userName,
      email: normalizedEmail,
      password: hashedPassword,
      mobile,
      role
    });

    if (inviteRecord) {
      await ManagerInvites.deleteOne({ _id: inviteRecord._id });
      return res.status(201).json({ message: messages.manager.verifySuccess });
    }

    return res.status(201).json({ message: messages.user.addSuccess });

  } catch (error) {
    console.log(error);
    // Handle Duplicate Key Errors (Unique Username, Email, or Mobile)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const customMsg = modelMessages.user[field]?.unique || messages.common.duplicate;
      return res.status(409).json({ message: customMsg });
    }

    // Handle Mongoose Validation Errors (Username length, Mobile regex, etc.)
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    console.error("Signup Error:", error);
    return res.status(500).json({ message: messages.common.serverError });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: modelMessages.user.email.required });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: messages.password.emailNotFound });

    return res.status(200).json({ message: messages.password.emailVerified });
  } catch (error) {
    return res.status(500).json({ message: messages.common.serverError });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate new password length before hashing
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: modelMessages.user.password.minLength });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { password: hashedPassword }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: messages.password.emailNotFound });
    }

    return res.status(200).json({ message: messages.password.resetSuccess });
  } catch (error) {
    return res.status(500).json({ message: messages.common.serverError });
  }
};

const inviteManager = async (req, res) => {
  try {
    const { email, _id } = req.body;
    if (!email) {
      return res.status(400).json({ message: modelMessages.user.email.required });
    }

    // 1. Generate a new unique token
    const token = crypto.randomBytes(32).toString('hex');
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Upsert logic: Find by email and update the token/invitedBy
    // If it doesn't exist, 'upsert: true' creates it.
    await ManagerInvites.findOneAndUpdate(
      { email: normalizedEmail },
      {
        token,
        invitedBy: _id,
        createdAt: new Date() // Reset the timestamp so it doesn't expire immediately
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 3. Send the email with the NEW token
    await sendManagerInvite(normalizedEmail, token);

    return res.status(200).json({ message: messages.manager.inviteSuccess });

  } catch (err) {
    console.error("Invite Error:", err);
    // Duplicate error handling is no longer strictly needed for email due to findOneAndUpdate,
    // but kept for general safety.
    if (err.code === 11000) {
      return res.status(400).json({ message: messages.common.duplicate });
    }
    return res.status(500).json({ error: messages.common.serverError });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    // 1. Get query parameters with default values
    const {
      page = 1,
      limit = 10,
      userName,
      email,
      mobile,
      sortBy = 'userName',
      order = 'asc'
    } = req.query;

    // 2. Build the Search/Filter Object
    // We start by forcing the role to 'employee' so managers/admins aren't listed
    let query = { role: 'employee' };

    // --- Search by userName (Partial match, case-insensitive) ---
    if (userName) {
      query.userName = { $regex: userName, $options: 'i' };
    }

    // --- Search by email (Partial match, case-insensitive) ---
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }

    // --- Search by mobile (Partial match) ---
    if (mobile) {
      query.mobile = { $regex: mobile, $options: 'i' };
    }

    // 3. Execute Pagination logic
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    const skip = (pageInt - 1) * limitInt;

    // 4. Fetch data and count total for frontend metadata
    // We use Promise.all to run both queries in parallel for better performance
    const [employees, totalDocs] = await Promise.all([
      User.find(query)
        .select('-password') // Never send passwords to frontend
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 }) // Dynamic sorting
        .skip(skip)
        .limit(limitInt),
      User.countDocuments(query)
    ]);

    // 5. Send Response with metadata
    return res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        totalItems: totalDocs,
        totalPages: Math.ceil(totalDocs / limitInt),
        currentPage: pageInt,
        limit: limitInt
      }
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      message: messages.user?.fetchError || "Failed to fetch employee records"
    });
  }
};

// GET current user details
const getMe = async (req, res) => {
  try {
    // req.user.id comes from your verifyJWT middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

// UPDATE user details (userName and mobile only)
const updateProfile = async (req, res) => {
  try {
    const { userName, mobile } = req.body;

    // Find and update - we do NOT include email in the update object
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { userName, mobile },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: messages.common.serverError });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    // Run all counts and fetches in parallel
    const [
      totalEmployees,
      pendingLeaves,
      pendingWfh,
      totalInvited,
      invitedList,
      activeLeavesToday,
      activeWfhToday
    ] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      LeaveRequest.countDocuments({ status: 'Pending' }),
      WfhRequest.countDocuments({ status: 'Pending' }),
      ManagerInvites.countDocuments(),
      ManagerInvites.find().sort({ createdAt: -1 }), // Fetch the actual list
      // People on Approved Leave TODAY
      LeaveRequest.countDocuments({
        status: 'Approved',
        startDate: { $lte: today },
        endDate: { $gte: today }
      }),
      // People on Approved WFH TODAY
      WfhRequest.countDocuments({
        status: 'Approved',
        startDate: { $lte: today },
        endDate: { $gte: today }
      })
    ]);

    // Calculate In-Office count
    const onLeave = activeLeavesToday;
    const wfh = activeWfhToday;
    const inOffice = Math.max(0, totalEmployees - (onLeave + wfh));

    res.status(200).json({
      summary: {
        totalEmployees,
        pendingLeaves,
        pendingWfh,
        totalInvited
      },
      pieChart: {
        onLeave,
        wfh,
        inOffice
      },
      invitedManagers: invitedList
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

// Example logic for an employee-specific stats endpoint
const getEmployeeStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const pendingLeave = await LeaveRequest.countDocuments({ userId, status: 'Pending' });
    const pendingWfh = await WfhRequest.countDocuments({ userId, status: 'Pending' });
    const recentRequests = await LeaveRequest.find({ userId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      leaveBalance: user.leaves,
      pendingCount: pendingLeave + pendingWfh,
      recentRequests
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  checkEmail,
  resetPassword,
  getDashboardStats,
  getEmployeeStats,
  getMe,
  updateProfile
};