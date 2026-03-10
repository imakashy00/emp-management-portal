const fs = require('fs');
const path = require('path');
const User = require("../models/userModel");
const LeaveRequest = require("../models/leaveRequestModel");
const { buildSmartQuery } = require('../utils/queryHelper');
const calculateDays = require('../utils/calculateDays');


exports.addLeaveRequest = async (req, res) => {
  let newReq = null;
  try {
    const { startDate, endDate, reason, leaveType } = req.body;
    const { id: employeeId } = req.user
    const file = req.file ? req.file.filename : null;

    // 1. Check if user exists and is an employee
    const user = await User.findById(employeeId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== 'employee') return res.status(400).json({ message: "Managers cannot apply for leaves" });

    // 2. Calculate requested days
    const requestedDays = calculateDays(startDate, endDate);

    // 3. Check balance
    if (user.leaves < requestedDays) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: `Insufficient leave balance. Remaining: ${user.leaves}` });
    }

    newReq = await LeaveRequest.create({
      employeeId, startDate, endDate, reason, leaveType, file
    });

    // 4. Deduct balance and create request
    user.leaves -= requestedDays;
    await user.save();


    res.status(200).json({ message: "Leave Request Submitted", remainingLeaves: user.leaves, data: newReq });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    if (newReq) {
      await LeaveRequest.findByIdAndDelete(newReq._id);
    }
    res.status(400).json({ message: error.message });
  }
};


exports.getLeaveRequestsByUserId = async (req, res) => {
  try {
    const { id: employeeId } = req.user;
    // console.log(employeeId)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // console.log('eemployee:', id)
    // Pass employeeId into the query helper
    const query = await buildSmartQuery(req, null, { employeeId });

    const [data, total] = await Promise.all([
      LeaveRequest.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      LeaveRequest.countDocuments(query)
    ]);

    res.status(200).json({ data, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE: Only allowed if status is 'Pending'

exports.updateLeaveRequest = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    // 1. Security Check: Only the owner can update
    if (leave.employeeId.toString() !== req.user.id && req.user.role !== 'manager') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // 2. Status Lock: Cannot edit processed leaves
    if (leave.status !== 'Pending') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Processed requests cannot be modified." });
    }

    const user = await User.findById(leave.employeeId);

    // 3. Balance Recalculation (Critical)
    const oldDays = calculateDays(leave.startDate, leave.endDate);
    const newStartDate = req.body.startDate || leave.startDate;
    const newEndDate = req.body.endDate || leave.endDate;
    const newDays = calculateDays(newStartDate, newEndDate);

    if (newDays !== oldDays) {
      const balanceAdjustment = oldDays - newDays; // Positive if new duration is shorter
      if (user.leaves + balanceAdjustment < 0) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Insufficient leave balance for this change." });
      }
      user.leaves += balanceAdjustment;
      await user.save();
    }

    // 4. Update Fields
    Object.assign(leave, req.body);

    // 5. File Handling (Delete old if new exists)
    if (req.file) {
      if (leave.file) {
        // Resolve path correctly relative to the current file
        const oldFilePath = path.join(__dirname, '../uploads', leave.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      leave.file = req.file.filename;
    }

    await leave.save();
    res.status(200).json({ message: "Updated Successfully", data: leave });

  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path); // Cleanup on crash
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

    // Refund leaves to user
    const daysToRefund = calculateDays(leave.startDate, leave.endDate);
    await User.findByIdAndUpdate(leave.employeeId, { $inc: { leaves: daysToRefund } });

    if (leave.file) {
      const filePath = path.join(__dirname, '../uploads', leave.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted and leaves refunded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getManagerLeaveRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = await buildSmartQuery(req, User);

    const [data, total] = await Promise.all([
      LeaveRequest.find(query).populate('employeeId', 'userName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      LeaveRequest.countDocuments(query)
    ]);

    res.status(200).json({ data, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

exports.changeLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Request not found" });

    // If the manager rejects a request that was previously Pending
    if (leave.status === 'Pending' && status === 'Rejected') {
      const daysToRefund = calculateDays(leave.startDate, leave.endDate);
      await User.findByIdAndUpdate(leave.employeeId, { $inc: { leaves: daysToRefund } });
    }

    // If a manager moves a request from Rejected back to Approved (Edge case)
    if (leave.status === 'Rejected' && status === 'Approved') {
      const user = await User.findById(leave.employeeId);
      const daysToDeduct = calculateDays(leave.startDate, leave.endDate);
      if (user.leaves < daysToDeduct) return res.status(400).json({ message: "User no longer has enough leave balance to approve this." });
      user.leaves -= daysToDeduct;
      await user.save();
    }

    leave.status = status;
    await leave.save();
    res.status(200).json({ message: `Request ${status}`, data: leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

