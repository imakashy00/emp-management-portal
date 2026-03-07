const express = require('express');
const router = express.Router();
const { viewWfhRequests, getWfhRequestById, addWfhRequest, updateWfhRequest, deleteWfhRequest, changeWfhStatus, } = require('../controllers/wfhRequestController');
const { verifyJWT, validateRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload');


// All WFH routes require valid login
router.use(verifyJWT);

// Shared View Routes
router.get('/', viewWfhRequests);
router.get('/:id', getWfhRequestById);

// Note: 'file' inside upload.single('file') must match the Key name in Postman/Frontend
router.post(
    '/',
    validateRole('employee'),
    upload.single('file'),
    addWfhRequest
);

router.put(
    '/:id',
    validateRole('employee'),
    upload.single('file'),
    updateWfhRequest
);

router.delete('/:id', validateRole('employee','manager'), deleteWfhRequest);

// Manager Only
router.patch('/:id/status', validateRole('manager'), changeWfhStatus);

module.exports = router;