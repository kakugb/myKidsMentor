const express = require('express');
const router = express.Router();
const { getTutorProfile, updateTutorProfile,getAllTutorProfiles ,getTutorProfileById} = require('../controller/tutorController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');
const upload =require('../utils/multer.js')

router.get('/allprofile',  getAllTutorProfiles);


// Get tutor profile
router.get('/profile', authMiddleware,  getTutorProfile);

router.get('/:tutorId', getTutorProfileById);


// Update tutor profile
router.put('/profile/:id', authMiddleware, upload.single('profilePicture'), roleMiddleware('tutor'), updateTutorProfile);

module.exports = router;
