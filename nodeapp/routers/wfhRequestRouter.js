// const express = require('express');
// const router = express.Router();
// const wfhController = require('../controllers/wfhRequestController');
// const { verifyJWT } = require('../middleware/auth');
// const messages = require('../errorMessages/controllerError.json');

// // Helper for RBAC
// const restrictTo = (role) => {
//     console.log(role)
//     return (req, res, next) => {
//         if (req.body.role === role) {
//             return res.status(403).json({ message: messages.auth.forbidden });
//         }
//         next();
//     };
// };

// // All WFH routes require valid login
// router.use(verifyJWT);

// // Shared View Routes
// router.get('/', wfhController.viewWfhRequests);
// router.get('/:id', wfhController.getWfhRequestById);

// // Employee Only: Create, Edit, Delete
// router.post('/', restrictTo('employee'), wfhController.addWfhRequest);
// router.put('/:id', restrictTo('employee'), wfhController.updateWfhRequest);
// router.delete('/:id', restrictTo('employee'), wfhController.deleteWfhRequest);

// // Manager Only: Change Status
// router.patch('/:id/status', restrictTo('manager'), wfhController.changeWfhStatus);

// module.exports = router;

const express = require('express');
const router = express.Router();
const wfhController = require('../controllers/wfhRequestController');
const { verifyJWT } = require('../middleware/auth');

// CORRECTED RBAC Helper
const restrictTo = (role) => {
    return (req, res, next) => {
        // 1. Get role from req.user (set by verifyJWT), NOT req.body
        // 2. If user role does NOT match required role, return Forbidden
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: "Access denied: Unauthorized role" });
        }
        next();
    };
};

// All WFH routes require valid login
router.use(verifyJWT);

// Shared View Routes
router.get('/', wfhController.viewWfhRequests);
router.get('/:id', wfhController.getWfhRequestById);

// Employee Only
router.post('/', restrictTo('employee'), wfhController.addWfhRequest);
router.put('/:id', restrictTo('employee'), wfhController.updateWfhRequest);
router.delete('/:id', restrictTo('employee'), wfhController.deleteWfhRequest);

// Manager Only
router.patch('/:id/status', restrictTo('manager'), wfhController.changeWfhStatus);

module.exports = router;
