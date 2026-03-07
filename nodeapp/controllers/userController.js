const User = require('../models/userModel');
const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const ManagerInvites = require('../models/managerInvites');
const { generateToken } = require('../middlewares/auth');
const sendManagerInvite = require('../services/sendMail');

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
    const { userName, email, password, mobile, role, token } = req.body;
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
      assignedRole = 'manager'; 
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
      mobile
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
    if (!email) return res.status(400).json({ message: modelMessages.user.email.required });

    const token = crypto.randomBytes(32).toString('hex');
    await ManagerInvites.create({ email, token, invitedBy: _id });
    await sendManagerInvite(email, token);
    return res.status(200).json({ message: messages.manager.inviteSuccess });
  } catch (err) {
    console.log(err);
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

module.exports = {
  getUserByEmailAndPassword,
  addUser,
  getAllEmployees,
  inviteManager,
  checkEmail,
  resetPassword,
};