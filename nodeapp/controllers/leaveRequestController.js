const fs = require('fs');
const path = require('path');
const LeaveRequest = require("../models/leaveRequestModel");

// CREATE: New requests default to 'Pending'
exports.addLeaveRequest = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, reason, leaveType } = req.body;
    const file = req.file ? req.file.filename : null;

    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const newReq = await LeaveRequest.create({
      employeeId, startDate, endDate, reason, leaveType, file
    });
    res.status(200).json({ message: "Leave Request Submitted", data: newReq });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path); // Cleanup file if DB fails
    res.status(400).json({ message: error.message });
  }
};

// READ: Paginated fetch for a specific employee
exports.getLeaveRequestsByUserId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const query = { employeeId, reason: { $regex: search, $options: "i" } };
    
    const totalDocs = await LeaveRequest.countDocuments(query);
    const data = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ 
      total: totalDocs, 
      pages: Math.ceil(totalDocs / limit), 
      data: data 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Only allowed if status is 'Pending'
exports.updateLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    // Status Lock
    if (leave.status !== 'Pending') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Processed requests cannot be modified." });
    }
    
    // Apply updates
    Object.assign(leave, req.body);

    if (req.file) {
      // Remove old file from disk
      if (leave.file) {
        const oldPath = path.join(__dirname, '../uploads', leave.file);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      leave.file = req.file.filename;
    }
    
    await leave.save(); // Triggers Schema validation
    res.status(200).json({ message: "Updated Successfully", data: leave });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Only allowed if status is 'Pending'
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: "Cannot delete processed requests." });
    }

    if (leave.file) {
      const filePath = path.join(__dirname, '../uploads', leave.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};