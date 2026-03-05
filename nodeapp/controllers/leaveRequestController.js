const LeaveRequest = require('../models/leaveRequestModel');
const messages = require('../errorMessages/controllerError.json');

const viewLeaves = async (req, res) => {
  try {
    let leaves;
    // req.user.role is populated by your verifyJWT middleware
    if (req.user.role === 'manager') {
      leaves = await LeaveRequest.find()
        .populate('employeeId', 'userName email')
        .sort({ createdAt: -1 });
    } else {
      leaves = await LeaveRequest.find({ employeeId: req.user.id })
        .sort({ createdAt: -1 });
    }

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, message: messages.leave.fetchError });
    }
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || messages.common.serverError });
  }
};

const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: messages.leave.notFound });
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

const addLeaveRequest = async (req, res) => {
  try {
    // req.user.id comes from your verifyJWT middleware
    const leaveData = { ...req.body, employeeId: req.user.id };
    const leaveRequest = await LeaveRequest.create(leaveData);
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message || messages.common.serverError });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: messages.leave.notFound });

    // Ownership check
    if (leave.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: messages.leave.updateUnauthorized });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

const changeLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Approved', 'Rejected', 'Pending'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: messages.leave.invalidStatus });
    }

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) return res.status(404).json({ success: false, message: messages.leave.notFound });
    res.status(200).json({ success: true, data: updatedLeave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ success: false, message: messages.leave.notFound });

    // Only allow owner to delete
    if (leaveRequest.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: messages.auth.unauthorized });
    }

    // Business logic: Only delete if not processed
    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({ success: false, message: messages.leave.deleteStatusError });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: messages.leave.deleteSuccess });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  viewLeaves,
  getLeaveRequestById,
  addLeaveRequest,
  updateLeaveRequest,
  changeLeaveStatus,
  deleteLeaveRequest
};