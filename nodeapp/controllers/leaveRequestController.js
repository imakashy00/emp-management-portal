const LeaveRequest = require('../models/leaveRequestModel');

const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.create(req.body);
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const updated = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getLeaveRequestById, addLeaveRequest, updateLeaveRequest };