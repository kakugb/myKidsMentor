const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controller/authController.js');
const upload =require('../utils/multer.js')


router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

module.exports = router;
