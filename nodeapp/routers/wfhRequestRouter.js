const express = require('express');
const router = express.Router();
const workFromhome = require('../controllers/wfhController');
const { generateToken, verifyJWT } = require('../middleware/auth');

// All routes require login
router.use(generateToken);

// View Requests (Shared - Manager views list, Employee views personal)
router.get('/', workFromhome.viewWfhRequests);
router.get('/:id', workFromhome.getWfhRequestById);

// Employee Only: Create, Edit, Delete
router.post('/', verifyJWT('employee'), workFromhome.addWfhRequest);
router.put('/:id', verifyJWT('employee'), workFromhome.updateWfhRequest);
router.delete('/:id', verifyJWT('employee'), workFromhome.deleteWfhRequest);

// Manager Only: Change Status
router.patch('/:id/status', verifyJWT('manager'), workFromhome.changeWfhStatus);

module.exports = router;