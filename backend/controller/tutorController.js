const  User  = require('../models/user.js')
const cloudinary = require('../config/cloudinaryConfig.js');
const fs = require('fs');

exports.getAllTutorProfiles = async (req, res) => {
  try {
    // Fetch all users with the role 'tutor'
    const tutors = await User.findAll({
      where: { role: 'tutor' }, // Ensure only tutors are fetched
      attributes: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'profilePicture',
        'qualifications',
        'subjectsTaught',
        'gradesHandled',
        'certifications',
        'hourlyRates',
        'availability',
        'city',
        'postcode',
      ], // Select only the necessary fields
    });

    // Check if tutors exist
    if (tutors.length === 0) {
      return res.status(404).json({ message: 'No tutors found' });
    }

    // Return the list of tutors
    return res.status(200).json({ success: true, tutors });
  } catch (error) {
    console.error('Error fetching all tutor profiles:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getTutorProfile = async (req, res) => {
  try {
    const user = req.user;  // user is an object containing 'user' as a key with the actual data
    if (!user || !user.user || !user.user.dataValues) {
      return res.status(404).json({ message: 'User data not found' });
    }

    // Correctly access data within dataValues
    const id = user.user.dataValues.id; // Add id here
    const phoneNumber = user.user.dataValues.phoneNumber;
    const profilePicture = user.user.dataValues.profilePicture;
    const qualifications = user.user.dataValues.qualifications;
    const subjectsTaught = user.user.dataValues.subjectsTaught;
    const gradesHandled = user.user.dataValues.gradesHandled;
    const certifications = user.user.dataValues.certifications;
    const hourlyRates = user.user.dataValues.hourlyRates;
    const availability = user.user.dataValues.availability;
    const city = user.user.dataValues.city;
    const postcode = user.user.dataValues.postcode;

    // Construct tutor profile and include id
    const tutorProfile = {
      id, // Send id in the response
      phoneNumber,
      profilePicture,
      qualifications,
      subjectsTaught,
      gradesHandled,
      certifications,
      hourlyRates,
      availability,
      city,
      postcode,
    };

    return res.status(200).json(tutorProfile);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTutorProfileById = async (req, res) => {
  try {
    const { tutorId } = req.params; // Get tutorId from the route parameter

    // Fetch the tutor's profile by ID
    const tutor = await User.findByPk(tutorId); // Adjust this to your database query method

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Construct and return the tutor profile
    const tutorProfile = {
      id: tutor.id,
      phoneNumber: tutor.phoneNumber,
      profilePicture: tutor.profilePicture,
      qualifications: tutor.qualifications,
      subjectsTaught: tutor.subjectsTaught,
      gradesHandled: tutor.gradesHandled,
      certifications: tutor.certifications,
      hourlyRates: tutor.hourlyRates,
      availability: tutor.availability,
      city: tutor.city,
      postcode: tutor.postcode,
    };

    return res.status(200).json(tutorProfile);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};







exports.updateTutorProfile = async (req, res) => {
  try {
    // Find the tutor by their ID 
    console.log(req.params.id)
    const tutor = await User.findByPk(req.params.id); // Use req.params.id here
   
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    // Handle profile picture update
    if (req.file) {
      // Delete old profile picture from Cloudinary if it exists
      if (tutor.profilePicture) {
        const publicId = tutor.profilePicture.split('/').pop().split('.')[0]; // Extract public ID
        await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
      }

      // Upload new profile picture to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_pictures',
      });

      // Set new profile picture URL
      tutor.profilePicture = result.secure_url;

      // Remove file from server after upload
      fs.unlinkSync(req.file.path);
    }

    const updatableFields = [
      'name',
      'email',
      'phoneNumber',
      'qualifications',
      'subjectsTaught',
      'gradesHandled',
      'teachingExperience',
      'hourlyRates',
      'availability',
      'certifications',
      'city',
      'postcode',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        tutor[field] =
          ['subjectsTaught', 'gradesHandled', 'availability'].includes(field)
            ? Array.isArray(req.body[field])
              ? req.body[field]
              : req.body[field].includes(',')
              ? req.body[field].split(',').map((item) => item.trim())
              : JSON.parse(req.body[field])
            : req.body[field];
      }
    });

    await tutor.save();

    res.status(200).json({ message: 'Profile updated successfully', tutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

