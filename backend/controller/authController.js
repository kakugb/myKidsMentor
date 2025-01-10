// authController.js

const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    gender,
    subjectsTaught,
    gradesHandled,
    teachingExperience,
    hourlyRates,
    availability,
    qualifications,
    city,
    postcode
  } = req.body;

  let finalSubjectsTaught = req.body.subjectsTaught ? req.body.subjectsTaught : [];
  let finalGradesHandled = req.body.gradesHandled ? req.body.gradesHandled : [];

  try {
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser)
    //   return res.status(400).json({ message: "User already exists" });

    let profilePictureUrl = null;
    let certificationsUrl = [];

    // Save profile picture
    if (req.files?.profilePicture) {
      const profilePicture = req.files.profilePicture[0];
      profilePictureUrl = profilePicture.filename;  // Just save the filename

    }

    // Save certifications
    if (req.files?.certifications) {
      certificationsUrl = req.files.certifications.map(file => file.filename); // Store only the filename
    }

    let availabilityData = [];
    if (req.body.availability) {
      // Parsing the stringified availability data into objects
      availabilityData = req.body.availability.map(item => {
        try {
          // Parse the string into an actual JSON object
          let parsedItem = JSON.parse(item);
          // Here you can transform the data as needed (e.g., reformatting times, adding default values)
          return parsedItem;
        } catch (error) {
          console.error("Error parsing availability item:", error);
          return null;  // You can decide how to handle invalid data (e.g., ignore or return an error)
        }
      }).filter(item => item !== null); // Filter out any invalid items if necessary
    }

    // You can log to check the final availability data after processing
    console.log("Processed Availability Data:", availabilityData);

// console.log( name,
//   email,
//   password,
//   role,
//   gender,
//   phoneNumber,
//    profilePictureUrl,
//   qualifications,
//   finalSubjectsTaught,
//  finalGradesHandled,
//   teachingExperience,
//   hourlyRates,
//   availabilityData,
//  certificationsUrl,
//   city,
//   postcode)

    await User.create({
      name,
      email,
      password,
      role,
      gender,
      phoneNumber,
      profilePicture: profilePictureUrl,
      qualifications,
      subjectsTaught: finalSubjectsTaught,
      gradesHandled: finalGradesHandled,
      teachingExperience,
      hourlyRates,
      availability: availabilityData,
      certifications: certificationsUrl,
      city,
      postcode
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error registering user" });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Admin has not approved your account yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
