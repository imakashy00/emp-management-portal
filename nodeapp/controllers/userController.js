const User = require('../models/userModel');
const { generateToken } = require('../authUtils');

const getUserByEmailAndPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken(user);
    res.status(200).json({
      userName: user.userName,
      role: user.role,
      token: token,
      id: user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getUserByEmailAndPassword, addUser };