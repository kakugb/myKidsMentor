// authController.js

const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig.js");
const { Readable } = require("stream");

const uploadFileToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadResult = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: folder },
      (error, result) => {
        if (error) {
          console.error(`Error uploading file to Cloudinary:`, error);
          reject("Error uploading file");
        } else {
          resolve(result.secure_url);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(file.data);
    bufferStream.push(null);
    bufferStream.pipe(uploadResult);
  });
};

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
 // Parse subjectsTaught and gradesHandled from the request body
let finalSubjectsTaught = req.body["subjectsTaught[]"]
? Array.isArray(req.body["subjectsTaught[]"])
  ? req.body["subjectsTaught[]"]
  : [req.body["subjectsTaught[]"]] // Wrap single value in an array
: [];

let finalGradesHandled = req.body["gradesHandled[]"]
? Array.isArray(req.body["gradesHandled[]"])
  ? req.body["gradesHandled[]"]
  : [req.body["gradesHandled[]"]] // Wrap single value in an array
: [];


  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    let profilePictureUrl = [];
    let certificationsUrl = [];

    if (req.files?.profilePicture) {
      const profilePicture = req.files.profilePicture;

      profilePictureUrl = await uploadFileToCloudinary(
        profilePicture,
        "profile_pictures"
      );
    } else {
      console.log("No profile picture provided");
    }
    if (req.files?.certifications) {
      const certifications = Array.isArray(req.files.certifications)
        ? req.files.certifications
        : [req.files.certifications];
      for (const file of certifications) {
        const certificationUrl = await uploadFileToCloudinary(
          file,
          "qualifications"
        );
        certificationsUrl.push(certificationUrl);
      }
    }

    let availabilityData = [];
    if (req.body["availability[0]"]) {
      for (let key in req.body) {
        if (key.startsWith("availability")) {
          try {
            availabilityData.push(JSON.parse(req.body[key]));
          } catch (error) {
            console.error("Invalid availability format");
            return res
              .status(400)
              .json({ message: "Invalid availability format" });
          }
        }
      }
    }

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
