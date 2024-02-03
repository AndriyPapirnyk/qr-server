const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllers');

router.post('/verifyUser', userController.verifyUser);

router.post('/createUser', userController.createUser);

router.get('/getAllUsers', userController.getAllUsers);

router.get('/getCount', userController.getCount);

// router.get('/getAllProducts', userController.getAllProducts);

router.get('/', userController.test);

module.exports = router;
