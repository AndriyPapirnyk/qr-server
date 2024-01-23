const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllers');

router.post('/getUser', userController.getUser);

router.get('/getUsers', userController.getAllUsers);

router.get('/', userController.test);

module.exports = router;