import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
const CheckReviews = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const tutorId = user?.id;

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper function to check availability for a specific day and time
  const isAvailable = (day, timeRange) => {
    // Mapping days to full names
    const dayMapping = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday"
    };

    // Check if tutor is available on the given day and within the time range
    return tutor.availability.some((item) => {
      // Match the day
      if (item.day !== dayMapping[day]) return false;

      // Check if the time range matches exactly
      return item.time === timeRange;
    });
  };

  // Fetch Tutor details
  useEffect(() => {
    const fetchTutorDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tutor/${tutorId}`
        );

        setTutor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/tutor/${tutorId}`
        );
        console.log(response);
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchReviews();
  }, []);

  // Calculate average rating
  const averageRating = (
    reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length || 0
  ).toFixed(1);

  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4); // Increment by 4
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container  p-5 lg:flex gap-10 ">
      {/* LEFT COLUMN: Tutor Details */}
      <div className="lg:w-10/12 bg-white p-5 rounded-md shadow-md mx-auto">
        {/* Profile Section */}
        <div className="flex gap-5 items-center justify-center ">
          <img
            src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
            alt="Tutor"
            className="w-24 h-24 object-cover rounded-full border"
          />
          <div>
            <h1 className="text-2xl font-bold">{tutor.name}</h1>
            <p className="text-gray-600">{tutor.title}</p>
            <p className="font-semibold text-green-600">{`$${tutor.hourlyRates}/hr`}</p>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-5 text-center">
          <h2 className="text-xl font-semibold">About me</h2>
        </div>
        <div className="w-10/12 block sm:flex justify-between">
          {/* Subjects Handled Section */}
          <div className="mt-5">
            <h2 className="text-xl font-semibold">Subjects Handled</h2>
            <ul className="list-disc pl-5">
              {tutor.subjectsTaught.map((subject, index) => (
                <li key={index} className="text-gray-700">
                  {subject}
                </li>
              ))}
            </ul>
          </div>

          {/* Grade Handled Section */}
          <div className="mt-5">
            <h2 className="text-xl font-semibold">Grade Handled</h2>
            <ul className="list-disc pl-5">
              {tutor.gradesHandled.map((Grade, index) => (
                <li key={index} className="text-gray-700">
                  {Grade}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Ratings and Reviews */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold">{averageRating}</span>
            <div className="text-yellow-400">
              {"★".repeat(Math.round(averageRating)) +
                "☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-gray-500">{`${reviews.length} review(s)`}</span>
          </div>

          <div className="mt-3">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border-b pb-3 mb-3 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`${BASE_URL_IMAGE}uploads/${review.parent.profilePicture}`}
                    alt={review.parent.name}
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{review.parent.name}</p>
                    <div className="text-yellow-400">
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}

            {/* See More Button */}
            {visibleReviews < reviews.length && (
              <button
                onClick={handleSeeMoreReviews}
                className="mt-3 text-blue-600 underline hover:text-blue-800"
              >
                See more reviews
              </button>
            )}
          </div>
        </div>

        {/* Qualifications */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Qualifications</h2>
          {tutor.qualifications}
        </div>

        <div className="mt-5">
          <h2 className="text-xl font-semibold">General Availability</h2>
          <table className="w-full mt-2 border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tutor?.availability?.map((item) => (
                <tr key={item.time}>
                  <td className="border p-2">{item.time}</td>
                  {daysOfWeek.map((day) => (
                    <td key={day} className="border p-2">
                      {isAvailable(day, item.time) ? "✓" : "x"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckReviews;
