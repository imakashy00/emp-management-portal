const LeaveRequest = require("../models/leaveRequestModel");

// CREATE: New requests default to 'Pending' in the Schema
exports.addLeaveRequest = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, leaveType } = req.body;
    const file = req.file ? req.file.filename : null;

    const newReq = await LeaveRequest.create({
      employeeId, startDate, endDate, reason, leaveType, file
    });
    res.status(200).json({ message: "Leave Request Submitted", data: newReq });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ: Paginated fetch
exports.getLeaveRequestsByUserId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = { employeeId, reason: { $regex: search, $options: "i" } };
    const total = await LeaveRequest.countDocuments(query);
    const data = await LeaveRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.status(200).json({ total, pages: Math.ceil(total / limit), data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Only allowed if status is 'Pending'
exports.updateLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    // --- SECURITY CHECK: Status must be Pending ---
    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        message: "Action denied: You can only update requests that are in 'Pending' status." 
      });
    }
    
    // Apply updates
    Object.assign(leave, req.body);
    if (req.file) leave.file = req.file.filename;
    
    await leave.save(); // Triggers Schema validation
    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Only allowed if status is 'Pending'
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    // --- SECURITY CHECK: Status must be Pending ---
    if (leave.status !== 'Pending') {
      return res.status(400).json({ 
        message: "Action denied: You cannot delete a request that has already been processed." 
      });
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};