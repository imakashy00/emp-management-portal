const LeaveRequest = require("../models/leaveRequestModel");


const addLeaveRequest = async (req, res) => {
  try {
    const { employeeId, userId, startDate, endDate, reason, leaveType } = req.body;
    const finalId = employeeId || userId;

    if (!finalId) return res.status(400).json({ message: "Employee ID is required" });

    // Multer attaches the file info to req.file
    const fileName = req.file ? req.file.filename : null;

    const newLeave = await LeaveRequest.create({
      employeeId: finalId,
      startDate,
      endDate,
      reason,
      leaveType,
      file: fileName, // Stores only the filename string in MongoDB
      status: 'Pending'
    });

    return res.status(200).json({ message: "Success", data: newLeave });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// ... keep other functions (update/delete/get) as they were

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

module.exports = { addLeaveRequest, deleteLeaveRequest, updateLeaveRequest, getLeaveRequestsByUserId }