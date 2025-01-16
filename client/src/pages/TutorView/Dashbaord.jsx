import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
const Dashboard = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    profilePicture: null,
    subjectsTaught: [],
    gradesHandled: [],
    certifications: "",
    qualifications: [],
    hourlyRates: "",
    availability: [],
    city: "",
    postcode: ""
  });

  const gradeOptions = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" }
  ];

  const subjectOptions = [
    { value: "math", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "english", label: "English" },
    { value: "history", label: "History" }
  ];

  const handleSubjectsChange = (selectedOptions) => {
    const newSubjects = selectedOptions.map((option) => option.value);

    // Merge new subjects with the previous ones, ensuring no duplicates
    setFormData({
      ...formData,
      subjectsTaught: [
        ...new Set([...formData.subjectsTaught, ...newSubjects]) // Using Set to ensure uniqueness
      ]
    });
  };

  const filteredSubjectOptions = subjectOptions.filter(
    (option) => !formData.subjectsTaught.includes(option.value)
  );

  const handleGradesChange = (selectedOptions) => {
    const newGrades = selectedOptions.map((option) => option.value);

    // Merge new grades with the previous ones, ensuring no duplicates
    setFormData({
      ...formData,
      gradesHandled: [
        ...new Set([...formData.gradesHandled, ...newGrades]) // Using Set to ensure uniqueness
      ]
    });
  };

  const filteredGradeOptions = gradeOptions.filter(
    (option) => !formData.gradesHandled.includes(option.value)
  );

  const removeSubject = (subjectToRemove) => {
    // Remove the subject from the formData.subjectsTaught array
    setFormData((prev) => ({
      ...prev,
      subjectsTaught: prev.subjectsTaught.filter(
        (subject) => subject !== subjectToRemove
      )
    }));
  };
  const removeGrade = (gradeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      gradesHandled: prev.gradesHandled.filter(
        (grade) => grade !== gradeToRemove
      )
    }));
  };

  const [newAvailability, setNewAvailability] = useState({ day: "", time: "" });

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addAvailability = () => {
    if (newAvailability.day && newAvailability.time) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, newAvailability]
      }));
      setNewAvailability({ day: "", time: "" }); // Clear the inputs
    } else {
      alert("Please fill in both day and time.");
    }
  };

  const removeAvailability = (index) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // For certifications, extract the file names to display them
      if (type === "file" && name === "profilePicture") {
        // If it's a file (for profilePicture), store the selected file
        setFormData({
          ...formData,
          profilePicture: files[0] // Save the file object (not just the filename)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value // Handle other inputs normally
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Only append the fields that need to be sent
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("hourlyRates", formData.hourlyRates);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("postcode", formData.postcode);

    // Append certifications only if new files are selected (not profilePicture)
    if (formData.qualifications) {
      formDataToSend.append(
        "qualifications",
        JSON.stringify(formData.qualifications)
      );
    }

    // Append arrays (availability, subjectsTaught, gradesHandled)
    formData.availability.forEach((item, index) => {
      formDataToSend.append(`availability[${index}]`, JSON.stringify(item)); // Ensuring proper format
    });
    formData.subjectsTaught.forEach((subject) => {
      formDataToSend.append("subjectsTaught[]", subject); // Use '[]' to indicate it's an array
    });
    formData.gradesHandled.forEach((grade) => {
      formDataToSend.append("gradesHandled[]", grade); // Use '[]' for array fields
    });

    // If a new profile picture is selected, add it to the form data
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    console.log(...formDataToSend.entries());

    try {
      const token = localStorage.getItem("token");
      // Assuming the tutor's ID is available from the state or context (e.g., formData.id)
      const apiUrl = `http://localhost:5000/api/tutor/profile/${formData.id}`;

      const response = await axios.put(apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensures correct handling of the form data
          Authorization: `Bearer ${token}` // Adds the Authorization header
        }
      });

      
      setFormData((prevFormData) => ({
        ...prevFormData,             
        ...response.data.tutor,     
      }));

    } catch (error) {
      console.error("Error:", error); 
    }
  };

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/tutor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFormData(response.data); 
      } catch (error) {
        console.error(
          "Error fetching tutor profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchTutorProfile();
  }, []);
  return (
    <div className="flex items-center justify-center p-4">
    <div className="w-full md:w-10/12 p-6 mx-auto shadow-xl shadow-slate-400 mt-4">
      {/* Display Profile Picture */}
      <div className="mb-6 flex items-center justify-center">
        {formData.profilePicture && (
          <img
            src={`${BASE_URL_IMAGE}uploads/${formData.profilePicture}`}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
      </div>
  
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          />
        </div>
  
        {/* Subjects Taught */}
        <div>
          <label
            htmlFor="subjectsTaught"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Subjects Taught
          </label>
          <Select
            id="subjectsTaught"
            options={filteredSubjectOptions}
            isMulti
            onChange={handleSubjectsChange}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Subjects"
          />
          {formData.subjectsTaught.map((subject) => (
            <div key={subject} className="flex items-center justify-between">
              <span>{subject}</span>
              <button
                onClick={() => removeSubject(subject)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
  
        {/* Grades Handled */}
        <div>
          <label
            htmlFor="gradesHandled"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Grades Handled
          </label>
          <Select
            id="gradesHandled"
            options={filteredGradeOptions}
            isMulti
            onChange={handleGradesChange}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Select Grades"
          />
          {formData.gradesHandled.map((grade) => (
            <div key={grade} className="flex items-center justify-between">
              <span>{grade}</span>
              <button
                onClick={() => removeGrade(grade)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
  
        {/* Other Input Fields */}
        <div>
          <label
            htmlFor="qualifications"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Qualifications
          </label>
          <input
            type="text"
            id="qualification"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          />
        </div>
  
        {/* Hourly Rate */}
        <div>
          <label
            htmlFor="hourlyRates"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Hourly Rate
          </label>
          <select
            id="hourlyRates"
            name="hourlyRates"
            value={formData.hourlyRates}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          >
            <option value="" disabled>
              Select hourly rate
            </option>
            <option value="20">20$</option>
            <option value="25">25$</option>
            <option value="30">30$</option>
            <option value="40">40$</option>
            <option value="50">50$</option>
            <option value="60">60$</option>
          </select>
        </div>
  
        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            City
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          >
            <option value="">Select City</option>
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
            <option value="rawalpindi">Rawalpindi</option>
            <option value="faisalabad">Faisalabad</option>
            <option value="peshawar">Peshawar</option>
            <option value="quetta">Quetta</option>
            <option value="multan">Multan</option>
            <option value="sialkot">Sialkot</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
        </div>
  
        {/* Postcode */}
        <div>
          <label
            htmlFor="postcode"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Postcode
          </label>
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            required
          />
        </div>
  
        {/* Profile Picture */}
        <div>
          <label
            htmlFor="profilePicture"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Upload Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            onChange={handleChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload an image or document for your profile picture.
          </p>
        </div>
  
        {/* Availability */}
        <div className="col-span-2">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Availability
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <select
                name="day"
                value={newAvailability.day}
                onChange={handleAvailabilityChange}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-1/2 p-2.5"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <input
                type="text"
                name="time"
                placeholder="e.g., 12:00 PM - 4:00 PM"
                value={newAvailability.time}
                onChange={handleAvailabilityChange}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              />
              <button
                type="button"
                onClick={addAvailability}
                className="bg-teal-700 text-white px-3 py-1 rounded-lg"
              >
                Add
              </button>
            </div>
            {/* Display Added Availability */}
            <ul className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
              {formData.availability.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-gray-700 font-medium">
                    {item.day}:{" "}
                    <span className="font-semibold">{item.time}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-red-600 text-sm font-medium hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="col-span-full flex justify-end">
          <button
            type="submit"
            className="w-full md:w-1/2 px-4 py-3 bg-teal-700 text-white text-xl font-bold rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default Dashboard;
