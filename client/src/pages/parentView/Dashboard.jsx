import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
import pencilimg from '../../assests/pencil-5798875.jpg'
function Dashboard() {
  const [tutorsWithReviews, setTutorsWithReviews] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    level: "",
    price: "",
    city: "",
    day: "",
    time: ""
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
    if (!filters.day || !filters.time) {
      setError(true);
    }  else {
      setError(false);
      
    
    try {
      // Construct the query params based on the selected filters
      const filterParams = {
        subjectsTaught: filters.subject,
        gradesHandled: filters.level,
        availability: JSON.stringify(availability), // Convert array to string
        hourlyRates: filters.price,
        city: filters.city
      };

      const response = await axios.get(
        "http://localhost:5000/api/filterTutor/filter",
        { params: filterParams }
      );

      // Ensure that the response contains valid data
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        const filteredTutors = response.data.data;

        // Fetch reviews for each filtered tutor and attach averageRating
        const tutorsWithReviews = await Promise.all(
          filteredTutors.map(async (tutor) => {
            const reviews = await fetchReviews(tutor.id); // Fetch reviews for each tutor

            // Calculate average rating
            const averageRating = reviews.length
              ? (
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0; // Default to 0 if no reviews

            return { ...tutor, reviews, averageRating };
          })
        );

        setTutorsWithReviews(tutorsWithReviews); // Update tutors with reviews and ratings
      } else {
        setTutorsWithReviews([]); // Clear tutors if no data matches filters
        setMessage(
          response.data.message || "No tutors found matching the filters."
        ); // Set error message
      }
    } catch (error) {
      console.error("Error fetching filtered tutors:", error);
      setTutorsWithReviews([]); // Clear tutors in case of error
      setError(
        "An error occurred while fetching tutors. Please try again later."
      ); // Display a generic error message
    }
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

            // Calculate average rating
            const averageRating = reviews.length
              ? (
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0; // Default to 0 if no reviews

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
console.log(tutorsWithReviews)
  return (
    <div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center gap-6 p-6 bg-gray-100 rounded-lg shadow-lg">
  {/* Subject Dropdown */}
  <div className="w-full">
    <label
      htmlFor="subject"
      className="block text-sm font-medium text-gray-700"
    >
      Subject
    </label>
    <select
      id="subject"
      name="subject"
      value={filters.subject}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
      className="block text-sm font-medium text-gray-700"
    >
      Level
    </label>
    <select
      id="level"
      name="level"
      value={filters.level}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
      className="block text-sm font-medium text-gray-700"
    >
      Price
    </label>
    <select
      id="price"
      name="price"
      value={filters.price}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
      className="block text-sm font-medium text-gray-700"
    >
      City
    </label>
    <select
      id="city"
      name="city"
      value={filters.city}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
      className="block text-sm font-medium text-gray-700"
    >
      Day
    </label>
    <select
      id="day"
      name="day"
      value={filters.day}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
      className="block text-sm font-medium text-gray-700"
    >
      Time
    </label>
    <select
      id="time"
      name="time"
      value={filters.time}
      onChange={handleFilterChange}
      className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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


  {/* Apply Filters Button */}
  <div className="col-span-full">
    <button
      onClick={handleApplyFilters}
      className="w-full bg-teal-700 text-white p-3 font-bold rounded-md hover:bg-teal-600 transition duration-200 shadow-md"
    >
      Apply Filters
    </button>
  </div>
  {error && (
    <div className="col-span-full text-red-600 text-sm font-semibold">
      Please select both Day and Time to filter.
    </div>
  )}
</div>


      {/* Tutor Cards */}
      <div className="w-full h-screen p-6 "
      >
        <h1 className="text-center text-4xl font-bold text-teal-700">List of Verfied Tutors</h1>
        <div className="max-w-6xl mx-auto p-6">
          {tutorsWithReviews.length > 0
            ? tutorsWithReviews.map((tutor) => (
                <Link
                  to={`/parent/tutorDetail/${tutor.id}`} // Replace with your desired route for tutor details
                  key={tutor.id}
                  className="block" // Ensure it behaves like a block to make the whole card clickable
                >
                  <div className="flex items-center mb-10 border rounded-lg shadow-xl shadow-slate-400 bg-white overflow-hidden p-6 transition-transform duration-300 ease-in-out hover:translate-y-[-10px]">
                    {/* Profile Picture */}
                    <div className="w-1/4 h-64">
                      <img
                        src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Profile Details */}
                    <div className="w-2/4 p-4 ml-2">
                      <h2 className="text-2xl font-bold mb-1">{tutor.name}</h2>
                      <p className="text-xl text-gray-600 font-bold mb-2">
                        {tutor.qualifications}
                      </p>
                      <p className="text-xl text-black font-bold leading-snug">
                        Subjects Taught : <span className="text-gray-700 font-semibold uppercase">{tutor.subjectsTaught.join(", ")}</span>
                      </p>
                      <p className="text-xl text-black font-bold  leading-snug mt-2">
                        Qualifications : <span className="text-gray-700 font-semibold uppercase">{tutor.city}</span>
                      </p>
                      <p className="text-xl text-black font-bold leading-snug mt-2">
                        Email : <span className="text-gray-700 font-semibold uppercase"> {tutor.email}</span>
                      </p>
                    </div>

                    {/* Hourly Rates & Rating */}
                    <div className="w-1/4 p-4 text-right">
                      <p className="text-lg font-semibold text-gray-800 ">
                        ${tutor.hourlyRates}
                        <span className="text-blue-500 font-bold text-lg no-underline">
                          /hr
                        </span>
                      </p>
                      <div className="flex items-center justify-end text-yellow-400 text-sm mt-1">
                        ⭐{" "}
                        <span className="text-gray-600 ml-1">
                          {tutor.averageRating > 0
                            ? `${tutor.averageRating} / 5`
                            : "No Ratings"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : messages && <p>No tutors found</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
