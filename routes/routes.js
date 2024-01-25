const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllers');

router.post('/verifyUser', userController.verifyUser);

router.get('/getUsers', userController.getAllUsers);

router.get('/', userController.test);

module.exports = router;