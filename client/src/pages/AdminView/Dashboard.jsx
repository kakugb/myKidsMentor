import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function Dashboard() {
  const [tutors, setTutors] = useState([]);
  const [error, setError] = useState(null);

  const fetchReviews = async (tutorId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorId}`
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching reviews for tutor ${tutorId}:`, err);
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

        // Fetch reviews for each tutor and calculate ratings
        const tutorsWithRatings = await Promise.all(
          tutorsData.map(async (tutor) => {
            const reviews = await fetchReviews(tutor.id);
            const averageRating = reviews.length
              ? (
                  reviews.reduce((total, review) => total + review.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : 0; // Default to 0 if no reviews
            return { ...tutor, reviews, averageRating };
          })
        );

        setTutors(tutorsWithRatings);
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setError("An error occurred while fetching tutor data.");
      }
    };

    fetchTutors();
  }, []);

  return (
    <div className="p-6">
      {/* Tutor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto ">
        {tutors.length > 0 ? (
          tutors.map((tutor) => (
            <Link
              to={`/admin/tutorProfileDetail/${tutor.id}`}
              key={tutor.id}
              className="block"
            >
              <div className="flex items-center mt-6 border rounded-lg shadow-lg shadow-slate-400 bg-white overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                {/* Profile Picture */}
                <div className="full sm:w-1/4 h-44">
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
                  <p className="text-sm text-gray-500 mt-1">
                    {tutor.reviews.length > 0
                      ? `${tutor.reviews.length} Review(s)`
                      : "No Reviews Yet"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>{error || "No tutors found"}</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
