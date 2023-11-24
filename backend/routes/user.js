const express = require('express');
const router = express.Router();

//Import Controller
const userCtrl = require('../controllers/user');

//POST
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;