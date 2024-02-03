const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllers');

router.post('/verifyUser', userController.verifyUser);

router.post('/createUser', userController.createUser);

router.post('/getAllProducts', userController.getAllProducts);

router.post('/saveRequest', userController.saveRequest);

router.get('/getAllUsers', userController.getAllUsers);

router.get('/getCount', userController.getCount);

module.exports = router;
