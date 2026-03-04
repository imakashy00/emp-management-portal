const User = require('../models/userModel');
const {generateToken}  = require('../middleware/auth');

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

module.exports = { getUserByEmailAndPassword, addUser, getAllEmployees };