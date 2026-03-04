const express = require('express');
const { getUserByEmailAndPassword, getAllEmployees, addUser,inviteManager, verifyManager } = require('../controllers/userController');

const router = express.Router();


router.post('/signup', addUser);

router.post('/login', getUserByEmailAndPassword);

router.get('/getAllEmployees', getAllEmployees);

router.post('/inviteManager', inviteManager);

router.post('/verifyManager', verifyManager);


module.exports = router
