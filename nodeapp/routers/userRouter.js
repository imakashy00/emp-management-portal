const express = require('express');
const { getUserByEmailAndPassword, getAllEmployees, addUser } = require('../controllers/userController');

const router = express.Router();

router.post('/login', getUserByEmailAndPassword);

router.post('/signup', addUser);

router.get('/getAllEmployees', getAllEmployees);

// router.post('/inviteManager', controller.inviteManager);

// router.post('/verifyManager', controller.verifyManager);


module.exports = router
