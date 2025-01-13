import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
function Dashboard() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    // Fetch all tutors when the component loads
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tutor/allprofile"
        );
        setTutors(response.data.tutors);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="p-6">
      {/* Tutor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            <Link
              to={`/admin/tutorProfileDetail/${tutor.id}`} // Replace with your desired route for tutor details
              key={tutor.id}
              className="block"
            >
              <div className="flex items-center border rounded-lg shadow-md bg-white overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                {/* Profile Picture */}
                <div className="w-1/4 h-44">
                  <img
                  src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                    
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
                    ⭐ <span className="text-gray-600 ml-1">0 / 5</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">New tutor</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No tutors found</p> // Show a message if no tutors are available
        )}
      </div>
    </div>
  );
}

export default Dashboard;
