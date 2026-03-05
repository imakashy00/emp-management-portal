const WfhRequest = require('../models/wfhRequestModel');
const messages = require('../errorMessages/controllerError.json');

const viewWfhRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'manager') {
      requests = await WfhRequest.find().populate('employeeId', 'userName email');
    } else {
      requests = await WfhRequest.find({ employeeId: req.user.id });
    }
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: messages.wfh.fetchError });
  }
};

const getWfhRequestById = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

const addWfhRequest = async (req, res) => {
  try {
    const newRequest = await WfhRequest.create({
      ...req.body,
      employeeId: req.user.id
    });
    res.status(201).json({ message: messages.wfh.addSuccess, data: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message || messages.common.serverError });
  }
};

const updateWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    if (request.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: messages.wfh.updateUnauthorized });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: messages.wfh.deleteStatusError });
    }

    const updated = await WfhRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

const deleteWfhRequest = async (req, res) => {
  try {
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    if (request.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: messages.auth.unauthorized });
    }
    
    await WfhRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: messages.wfh.deleteSuccess });
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

const changeWfhStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: messages.wfh.invalidStatus });
    }

    const updated = await WfhRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: messages.wfh.notFound });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

module.exports = { viewWfhRequests, getWfhRequestById, addWfhRequest, updateWfhRequest, deleteWfhRequest, changeWfhStatus };