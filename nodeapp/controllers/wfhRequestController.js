const fs = require('fs');
const path = require('path');
const WfhRequest = require("../models/wfhRequestModel");

const messages = require('../errorMessages/controllerError.json');

const viewWfhRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    // Build Query: Managers see all, Employees see only theirs
    let query = { reason: { $regex: search, $options: 'i' } };
    if (req.user.role !== 'manager') {
      query.employeeId = req.user.id;
    }

    const total = await WfhRequest.countDocuments(query);
    const data = await WfhRequest.find(query)
      .populate('employeeId', 'userName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      pages: Math.ceil(total / limit),
      data: data
    });
  } catch (error) {
    res.status(500).json({ message: messages.wfh.fetchError });
  }
};

const getWfhRequestById = async (req, res) => {
  try {
    // Should find by the document ID from the URL (:id)
    const request = await WfhRequest.findById(req.params.id).populate('employeeId', 'userName email');

    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    // Security: Only the owner or a manager should see this specific request
    if (req.user.role !== 'manager' && request.employeeId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};


const addWfhRequest = async (req, res) => {
  try {
    // 1. Capture the filename from Multer (req.file)
    // If no file was uploaded, fileName will be null
    const fileName = req.file ? req.file.filename : null;

    // 2. Destructure fields from req.body
    const { employeeId, startDate, endDate, reason } = req.body;

    // 3. Basic Validation
    if (!employeeId) {
      return res.status(400).json({ message: messages.wfh.employeeNotFound });
    }

    // 4. Create the request in the database
    const newRequest = await WfhRequest.create({
      employeeId,
      startDate,
      endDate,
      reason,
      file: fileName, // Save the filename string to the 'file' field in your Schema
      status: 'Pending'
    });

    // 5. Success Response
    res.status(201).json({
      message: messages.wfh.addSuccess,
      data: newRequest
    });

  } catch (error) {
    // 6. Detailed Error Handling
    console.error("Error adding WFH Request:", error);

    // If there is a Mongoose validation error (e.g., reason too short), 
    // it will return the specific message from your Schema.
    res.status(400).json({
      message: error.message || messages.common.serverError
    });
  }
};

// const fs = require('fs');
// const path = require('path');
// const WfhRequest = require("../models/wfhRequestModel");

const updateWfhRequest = async (req, res) => {
  try {
    // 1. Find the request first to check its current state
    const request = await WfhRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: messages.wfh.notFound });
    }

    // 2. Authorization Check: Ensure the user owns this specific request
    if (request.employeeId.toString() !== req.user.id) {
      return res.status(403).json({ message: messages.wfh.updateUnauthorized });
    }

    // 3. --- STATUS LOCK: ONLY ALLOW UPDATE IF PENDING ---
    if (request.status !== 'Pending') {
      // If the file was uploaded by Multer before this check, we should delete it 
      // to prevent "junk" files from staying on the server
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "This request has already been processed and cannot be modified."
      });
    }

    // 4. Prepare the data for update
    const updateData = { ...req.body };

    // 5. File Handling: If a new file is uploaded
    if (req.file) {
      // Delete the old file from the folder if it exists
      if (request.file) {
        const oldFilePath = path.join(__dirname, '../uploads', request.file);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      // Save the new filename to the update object
      updateData.file = req.file.filename;
    }

    // 6. Perform the update
    const updated = await WfhRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // runValidators ensures dates/reasons are still valid
    );

    res.status(200).json({
      message: messages.wfh.updatedRequest,
      data: updated
    });

  } catch (error) {
    // Safety check: delete the uploaded file if a server error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Update Error:", error);
    res.status(500).json({ message: messages.common.serverError });
  }
};


const deleteWfhRequest = async (req, res) => {
  try {
    // 1. Find the request
    const request = await WfhRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: messages.wfh.notFound });
    }

    // 2. Define permissions
    const isManager = req.user.role === 'manager';
    const isOwner = request.employeeId.toString() === req.user.id;

    // 3. Logic Check
    if (isManager) {
      // ✅ Manager can delete any request regardless of status
    } else if (isOwner) {
      // ❌ Employee can ONLY delete if status is 'Pending'
      if (request.status !== 'Pending') {
        return res.status(400).json({
          message: "You cannot delete a request that has already been approved or rejected."
        });
      }
    } else {
      // ❌ Neither manager nor owner
      return res.status(403).json({ message: messages.auth.unauthorized });
    }

    // 4. DELETE THE PHYSICAL FILE (if it exists)
    if (request.file) {
      const filePath = path.join(__dirname, '../uploads', request.file);
      // Check if file actually exists on the disk before trying to delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 5. Delete the record from MongoDB
    await WfhRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: messages.wfh.deleteSuccess });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: messages.common.serverError });
  }
};

const changeWfhStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. Validation
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: messages.wfh.invalidStatus });
    }

    // 2. Find and check if already processed
    const request = await WfhRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: messages.wfh.notFound });

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Request ${status}`, data: request });
  } catch (error) {
    res.status(500).json({ message: messages.common.serverError });
  }
};

module.exports = { viewWfhRequests, getWfhRequestById, addWfhRequest, updateWfhRequest, deleteWfhRequest, changeWfhStatus };