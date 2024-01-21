const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllers');

router.post('/getUser', userController.getUser);

module.exports = router;