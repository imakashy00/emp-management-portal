const fs = require('fs');
const path = require('path');
const WfhRequest = require("../models/wfhRequestModel");
const messages = require('../errorMessages/controllerError.json');
const User = require('../models/userModel');
const { buildSmartQuery } = require('../utils/queryHelper');

const viewWfhRequests = async (req, res) => {
  try {
    const { id: employeeId } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const query = await buildSmartQuery(req, null, { employeeId });

    const [data, total] = await Promise.all([
      WfhRequest.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      WfhRequest.countDocuments(query)
    ]);

    res.status(200).json({ data, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// CREATE
const addWfhRequest = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const { id: employeeId } = req.user;
    const fileName = req.file ? req.file.filename : null;

    if (!employeeId) return res.status(400).json({ message: "Employee ID is required" });

    const newRequest = await WfhRequest.create({
      employeeId, startDate, endDate, reason, file: fileName, status: 'Pending'
    });

    res.status(201).json({ message: messages.wfh.addSuccess, data: newRequest });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: error.message });
  }
};

// UPDATE: Only if Pending
const updateWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    if (request.status !== 'Pending') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Processed requests cannot be modified." });
    }

    Object.assign(request, req.body);

    if (req.file) {
      if (request.file) {
        const oldPath = path.join(__dirname, '../uploads', request.file);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      request.file = req.file.filename;
    }

    await request.save();
    res.status(200).json({ message: messages.wfh.updatedRequest, data: request });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Only if Pending
const deleteWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: "Cannot delete processed requests." });
    }

    if (request.file) {
      const filePath = path.join(__dirname, '../uploads', request.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await WfhRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: messages.wfh.deleteSuccess });
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

// MANAGER: Change Status
const changeWfhStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    request.status = status;
    await request.save();
    res.status(200).json({ message: `Request ${status}`, data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getManagerWfhRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const query = await buildSmartQuery(req, User);

    const [data, total] = await Promise.all([
      WfhRequest.find(query).populate('employeeId', 'userName email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      WfhRequest.countDocuments(query)
    ]);

    res.status(200).json({ data, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching manager view" });
  }
};
module.exports = {
  viewWfhRequests,
  addWfhRequest,
  updateWfhRequest,
  deleteWfhRequest,
  changeWfhStatus,
  getManagerWfhRequests
};