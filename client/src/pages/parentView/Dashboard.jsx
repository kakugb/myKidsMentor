import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import axios from "axios";

function Dashboard() {
  const [tutorsWithReviews, setTutorsWithReviews] = useState([]); // Store tutors with their reviews
  const [filters, setFilters] = useState({
    subject: "",
    level: "",
    price: "",
    city: "",
    day: "",
    time: "",
  });
  const [messages, setMessage] = useState([]);
 
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]); // Store availability array

  const updateAvailability = (selectedDay, selectedTime) => {
  
    if (selectedDay && selectedTime) {
      setAvailability([{ day: selectedDay, time: selectedTime }]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };

      // If the day or time changes, update availability
      if (name === "day" || name === "time") {
        updateAvailability(newFilters.day, newFilters.time); // Use newFilters, not filters
      }

      return newFilters;
    });
  };
  
 

  const handleApplyFilters = async () => {
    try {
      // Construct the query params based on the selected filters
      const filterParams = {
        subjectsTaught: filters.subject,
        gradesHandled: filters.level,
        availability: JSON.stringify(availability), // Convert array to string
        hourlyRates: filters.price,
        city: filters.city,
      };
  
      const response = await axios.get(
        "http://localhost:5000/api/filterTutor/filter",
        { params: filterParams }
      );
  
      // Ensure that the response contains valid data
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setTutorsWithReviews(response.data.data); // Update tutors if data is valid
      } else {
        setTutorsWithReviews([]); // Clear tutors if data is empty
        setMessage(response.data.message || "No tutors found matching the filters."); // Set error message
      }
    } catch (error) {
      console.error("Error fetching filtered tutors:", error);
      setTutorsWithReviews([]); // Clear tutors in case of error
      setError("An error occurred while fetching tutors. Please try again later."); // Display a generic error message
    }
  };
  
  

  const fetchReviews = async (tutorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorId}`
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return [];
    }
  };

  
 

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tutor/allprofile"
        );
        const tutorsData = response.data.tutors;
  
        // Fetch reviews for each tutor and attach them
        const tutorsWithReviews = await Promise.all(
          tutorsData.map(async (tutor) => {
            const reviews = await fetchReviews(tutor.id); // Fetch reviews for each tutor
            const averageRating = (
              reviews.reduce((total, review) => total + review.rating, 0) / 
              reviews.length || 0
            ).toFixed(1);
  
            return { ...tutor, reviews, averageRating };
          })
        );
        
        setTutorsWithReviews(tutorsWithReviews);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };
  
    fetchTutors();
  }, []);
  

  return (
    <div>
      {/* Filter Controls */}
      <div className="grid grid-cols-4 items-center gap-4 p-4 bg-gray-50 shadow-md rounded-md">
        {/* Subject Dropdown */}
        <div className="w-full">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-600"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Subjects</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="urdu">Urdu</option>
            <option value="biology">Biology</option>
            <option value="history">History</option>
            <option value="chemistry">Chemistry</option>
            <option value="physics">Physics</option>
          </select>
        </div>

        {/* Level Dropdown */}
        <div className="w-full">
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-600"
          >
            Level
          </label>
          <select
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="grade1">GRADE-1</option>
            <option value="grade2">GRADE-2</option>
            <option value="grade3">GRADE-3</option>
            <option value="grade4">GRADE-4</option>
            <option value="grade5">GRADE-5</option>
            <option value="grade6">GRADE-6</option>
            <option value="grade7">GRADE-7</option>
            <option value="grade8">GRADE-8</option>
            <option value="grade9">GRADE-9</option>
            <option value="grade10">GRADE-10</option>
          </select>
        </div>

        {/* Price Dropdown */}
        <div className="w-full">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-600"
          >
            Price
          </label>
          <select
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="20">20$</option>
            <option value="25">25$</option>
            <option value="30">30$</option>
            <option value="35">35$</option>
            <option value="40">40$</option>
            <option value="45">45$</option>
            <option value="50">50$</option>
            <option value="55">55$</option>
            <option value="60">60$</option>
          </select>
        </div>

        {/* City Dropdown */}
        <div className="w-full">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-600"
          >
            City
          </label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Day Dropdown */}
        <div className="w-full">
          <label
            htmlFor="day"
            className="block text-sm font-medium text-gray-600"
          >
            Day
          </label>
          <select
            id="day"
            name="day"
            value={filters.day}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        {/* Time Dropdown */}
        <div className="w-full">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-600"
          >
            Time
          </label>
          <select
            id="time"
            name="time"
            value={filters.time}
            onChange={handleFilterChange}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Time</option>
            <option value="9AM">9AM</option>
            <option value="10AM">10AM</option>
            <option value="11AM">11AM</option>
            <option value="12PM">12PM</option>
            <option value="1PM">1PM</option>
            <option value="2PM">2PM</option>
            <option value="3PM">3PM</option>
            <option value="4PM">4PM</option>
            <option value="5PM">5PM</option>
          </select>
        </div>

        <button
          onClick={handleApplyFilters}
          className="bg-blue-500 text-white p-2 mt-4 rounded-md"
        >
          Apply Filters
        </button>
      </div>

      {/* Tutor Cards */}
      <div className="max-w-6xl p-6">
 
 
 

      <div className="max-w-6xl p-6">
  {tutorsWithReviews.length > 0 ? (
    tutorsWithReviews.map((tutor) => (
      <Link
        to={`/parent/tutorDetail/${tutor.id}`} // Replace with your desired route for tutor details
        key={tutor.id}
        className="block" // Ensure it behaves like a block to make the whole card clickable
      >
        <div className="flex items-center mb-10 border rounded-lg shadow-lg bg-white overflow-hidden">
          {/* Profile Picture */}
          <div className="w-1/4 h-44">
            <img
              src={tutor.profilePicture || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Details */}
          <div className="w-2/4 p-4">
            <h2 className="text-lg font-bold mb-1">{tutor.name}</h2>
            <p className="text-sm text-gray-600 font-semibold mb-2">
              {tutor.qualifications}
            </p>
            <p className="text-sm text-gray-700 leading-snug">
              Subjects: {tutor.subjectsTaught.join(", ")}
            </p>
          </div>

          {/* Hourly Rates & Rating */}
          <div className="w-1/4 p-4 text-right">
            <p className="text-lg font-semibold text-gray-800 line-through">
              ${tutor.hourlyRates}
              <span className="text-blue-500 font-bold text-lg no-underline">
                /hr
              </span>
            </p>
            <div className="flex items-center justify-end text-yellow-400 text-sm mt-1">
              ⭐ <span className="text-gray-600 ml-1">{tutor.averageRating} / 5</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">New tutor</p>
          </div>
        </div>
      </Link>
    ))
  ) : (
    messages && <p>No tutors found</p> // Show a message if no tutors are available
  )}
</div>


</div>


    </div>
  );
}

export default Dashboard;
