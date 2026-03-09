const express = require('express');
const router = express.Router();
const {
  addWfhRequest,
  viewWfhRequests,
  updateWfhRequest,
  deleteWfhRequest,
  changeWfhStatus,
  getManagerWfhRequests,
} = require('../controllers/wfhRequestController');
const { verifyJWT, validateRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// All WFH routes require authentication
router.use(verifyJWT);

router.get('/', validateRole('manager'), getManagerWfhRequests);

router.get('/:employeeId', viewWfhRequests);

router.post('/', validateRole('employee'), upload.handleUpload('file'), addWfhRequest);

router.put('/:id', validateRole('employee'), upload.handleUpload('file'), updateWfhRequest);

router.delete('/:id', deleteWfhRequest);

router.patch('/:id/status', validateRole('manager'), changeWfhStatus);

module.exports = router;