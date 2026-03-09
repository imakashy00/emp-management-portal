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

/**
 * GET /api/wfhRequests/:employeeId
 * Parameters: page, limit, search, status
 */
router.get('/:employeeId', viewWfhRequests);

/**
 * POST /api/wfhRequests
 * Requirement: Role 'employee', supports file upload
 */
router.post('/', validateRole('employee'), upload.single('file'), addWfhRequest);

/**
 * PUT /api/wfhRequests/:id
 * Requirement: Role 'employee', only if status is Pending
 */
router.put('/:id', validateRole('employee'), upload.single('file'), updateWfhRequest);

/**
 * DELETE /api/wfhRequests/:id
 */
router.delete('/:id', deleteWfhRequest);

/**
 * PATCH /api/wfhRequests/:id/status
 * Requirement: Role 'manager'
 */
router.patch('/:id/status', validateRole('manager'), changeWfhStatus);

module.exports = router;