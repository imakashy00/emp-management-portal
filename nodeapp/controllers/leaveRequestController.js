const LeaveRequest = require('../models/LeaveRequest');

const viewLeaves = async (req, res) => {
  try {
    let leaves;
    if (req.user.role === 'manager') {
      leaves = await LeaveRequest.find()
        .populate('employeeId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      leaves = await LeaveRequest.find({ employeeId: req.user.id })
        .sort({ createdAt: -1 });
    }

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ success: false, message: "No leave requests found." });
    }
    res.status(200).json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const addLeaveRequest = async (req, res) => {
  try {
    const leaveData = { ...req.body, employeeId: req.user.id };
    const leaveRequest = await LeaveRequest.create(leaveData);
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Not found' });

    if (leave.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this request" });
    }

    const updated = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const changeLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Approved', 'Rejected', 'Pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, data: updatedLeave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) return res.status(404).json({ success: false, message: "Not found" });

    if (leaveRequest.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({ success: false, message: "Cannot delete processed request" });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
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