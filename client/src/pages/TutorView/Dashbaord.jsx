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
    // Assuming you're storing the selected options in an array in formData
    setFormData({
      ...formData,
      subjectsTaught: selectedOptions.map((option) => option.value) // Extract values
    });
  };

  const handleGradesChange = (selectedOptions) => {
    // Assuming you're storing the selected options in an array in formData
    setFormData({
      ...formData,
      gradesHandled: selectedOptions.map((option) => option.value) // Extract values
    });
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
      formDataToSend.append("qualifications", JSON.stringify(formData.qualifications));
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
  
      // Log the response data for debugging
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error); // Log any errors for debugging
    }
  };
  

  useEffect(() => {
    // Fetch tutor profile when the component loads
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

        setFormData(response.data); // Populate the fields
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
    <div className="flex items-center justify-center mt-5">
      <div className="w-10/12 p-6 bg-gray-200 mx-auto">
        {/* Profile Picture */}
        {/* Display Profile Picture */}
        <div className="mb-3 flex items-center justify-center">
  <div className="mt-4">
    {/* Assuming you have the Cloudinary link stored in the state as formData.profilePicture */}
    {formData.profilePicture && (
      <img
        src={`${BASE_URL_IMAGE}uploads/${formData.profilePicture}`}
        alt="Profile Picture"
        className="w-24 h-24 rounded-full object-cover"
      />
    )}
  </div>
</div>


        {/* Phone Number */}
        <form
          onSubmit={handleSubmit}
          className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-10 "
        >
          <div className="mb-3">
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
          <div className="mb-3">
            <label
              htmlFor="subjectsTaught"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Subjects Taught
            </label>
            <Select
              id="subjectsTaught"
              options={subjectOptions}
              isMulti
              onChange={handleSubjectsChange}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Subjects"
            />
            <p>{formData.subjectsTaught.join(", ")}</p>
          </div>

          {/* Grades Handled */}
          <div className="mb-3">
            <label
              htmlFor="gradesHandled"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Grades Handled
            </label>
            <Select
              id="gradesHandled"
              options={gradeOptions}
              isMulti
              onChange={handleGradesChange}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select Grades"
            />
            <p>{formData.gradesHandled.join(", ")}</p>
          </div>

          <div className="mb-3">
            <label
              htmlFor="certifications"
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
          <div className="mb-3">
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
          <div className="mb-3">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
              required
            />
          </div>

          {/* Postcode */}
          <div className="mb-3">
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
          <div className="mb-3">
            <label
              htmlFor="fileUpload"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              Upload for update Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              aria-describedby="file_help"
            />
            <p id="file_help" className="mt-1 text-sm text-gray-500">
              Please upload a file for update profile image(e.g., image,
              document).
            </p>
          </div>

          {/* Availability */}
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Availability
            </label>
            <div className="flex gap-2 mb-2">
              <select
                name="day"
                value={newAvailability.day}
                onChange={handleAvailabilityChange}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
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
                placeholder="e.g., 12:00pm to 4:00pm"
                value={newAvailability.time}
                onChange={handleAvailabilityChange}
                className="bg-gray-50 border  border-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5  w-full"
              />
              <button
                type="button"
                onClick={addAvailability}
                className="bg-green-500 text-white px-3 py-1 rounded-lg"
              >
                Add
              </button>
            </div>

            {/* Display Added Availability */}
            <ul className="list-disc pl-5">
              {formData.availability.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {item.day}: {item.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAvailability(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex mx-auto justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:shadow-outline"
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
