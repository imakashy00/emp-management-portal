const WfhRequest = require('../models/wfhRequestModel');

// View WFH Requests (Manager views all, Employee views personal)
const viewWfhRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'manager') {
      requests = await WfhRequest.find().populate('employeeId', 'name email');
    } else {
      requests = await WfhRequest.find({ employeeId: req.user.id });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

// View specific request details by ID
const getWfhRequestById = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// --- EMPLOYEE ACTIONS ---

// Create WFH Request
const addWfhRequest = async (req, res) => {
  try {
    const newRequest = await WfhRequest.create({
      ...req.body,
      employeeId: req.user.id // Link to logged-in employee
    });
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
};

// Edit WFH Request (Employee only)
const updateWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Not found' });

    // Ensure employee owns the request and it's still pending
    if (request.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot edit processed request' });
    }

    const updated = await WfhRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request' });
  }
};

// Delete WFH Request (Employee only)
const deleteWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request || request.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or not found' });
    }
    await WfhRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request' });
  }
};

// --- MANAGER ACTIONS ---

// Change Status (Approve/Reject)
const changeWfhStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await WfhRequest.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

module.exports = {
  viewWfhRequests,
  getWfhRequestById,
  addWfhRequest,
  updateWfhRequest,
  deleteWfhRequest,
  changeWfhStatus
};