import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./parent.css";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
const TutorDetail = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux
  const senderPhoneNumber = user?.phoneNumber;

  const { tutorId } = useParams();
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [tutor, setTutor] = useState(null);
  const [tutorPhoneNumber, setTutorPhoneNumber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);

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
        setTutorPhoneNumber(response.data.phoneNumber);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorDetails();
  }, [tutorId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/tutor/${tutorId}`
      );
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [tutorId]);

  // Calculate average rating
  const averageRating = (
    reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length || 0
  ).toFixed(1);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/userMessage?senderId=${user?.id}&receiverId=${tutorId}`
      );
      console.log("message", response.data);
      setMessages(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [senderPhoneNumber, tutorPhoneNumber]);

  const handleAddReview = async () => {
    if (!rating || !comment.trim()) return; // Ensure rating and comment are not empty

    const reviewData = {
      tutor_id: tutorId,
      parent_id: user?.id,
      rating: rating,
      comment: comment
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/reviews/add",
        reviewData
      );
      console.log("Review added:", response.data);
      // Optionally, you can update the reviews state to display the new review immediately
      setComment(""); // Clear the comment input
      setRating(0); // Reset the rating
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return; // Don't send if the message is empty

    const newMessage = {
      senderId: user?.id,
      receiverId: tutorId,
      content: messageText, // Make sure this matches the backend field name
      timestamp: new Date()
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/messages/send",
        newMessage
      );
      console.log("Message sent:", response.data);
      fetchMessages(); // Update UI with new message
      setMessageText(""); // Clear the input field
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4); // Increment by 4
  };

  if (loading) return <p>Loading...</p>;

  let certificationsArray = [];


  if (typeof tutor.certifications === "string") {
    try {
      certificationsArray = JSON.parse(tutor.certifications);
    } catch (error) {
      console.error("Error parsing certifications:", error);
    }
  } else if (Array.isArray(tutor.certifications)) {
    certificationsArray = tutor.certifications;
  }

  const handleToggleReviewForm = () => {
    setShowReviewForm(!showReviewForm); // Toggle the review form visibility
  };
  return (
    <div className="container mx-auto p-5 lg:flex gap-10 ">
      {/* LEFT COLUMN: Tutor Details */}
      <div className="lg:w-3/4  p-5 rounded-md shadow-md">
        {/* Profile Section */}
        <div className="flex gap-5 items-center">
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
        <div className="mt-5">
          <h2 className="text-xl font-semibold">About me</h2>
        </div>

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
        {/* Ratings and Reviews */}
        <div className="mt-5">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Ratings & Reviews
        {/* Pen Icon/Button to toggle the review form */}
        <button onClick={handleToggleReviewForm} className="text-gray-600">
          ✏️
        </button>
      </h2>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-3xl font-bold">{averageRating}</span>
        <div className="text-yellow-400">
          {"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}
        </div>
        <span className="text-gray-500">{`${reviews.length} review(s)`}</span>
      </div>

      <div className="mt-3">
        {reviews.slice(0, visibleReviews).map((review) => (
          <div key={review.id} className="border-b pb-3 mb-3">
            <div className="flex items-center gap-3">
              <img
                src={`${BASE_URL_IMAGE}uploads/${review.parent.profilePicture}`}
                alt={review.parent.name}
                className="w-12 h-12 object-cover rounded-full border"
              />
              <div>
                <p className="font-semibold">{review.parent.name}</p>
                <div className="text-yellow-400">
                  {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
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

      {/* Add Review Form - Initially hidden */}
      {showReviewForm && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold">Add a Review</h3>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400">
              {"★".repeat(rating) + "☆".repeat(5 - rating)}
            </span>
            <div className="flex gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here"
            className="w-full p-2 border rounded-md mt-2"
            rows="4"
          ></textarea>

          <button
            onClick={handleAddReview}
            className="w-full bg-blue-600 text-white py-2 rounded-md mt-3 hover:bg-blue-700"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>


        {/* Qualifications */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Qualifications</h2>
          {tutor.qualifications}
        </div>

        {certificationsArray.length > 0 ? (
          <div className="mt-5">
            <h2 className="text-xl font-semibold">Certifications</h2>
            <ul className="flex flex-wrap gap-x-6 mt-3">
              {certificationsArray.map((certificate, index) => (
                <li key={index} className="mb-2">
                  <Link
                    to={`${BASE_URL_IMAGE}uploads/${certificate}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    <img
                      src={`${BASE_URL_IMAGE}uploads/${certificate}`}
                      alt={`Certification ${index + 1}`}
                      className="w-16 h-16 object-cover border rounded"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No certifications available</p>
        )}

        {/* City */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">city</h2>
          {tutor.city}
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

      {/* RIGHT COLUMN: Messages Section */}
      <div className="relative">
        {/* Message Box */}
        {isMessageBoxVisible && (
          <div className="lg:w-1/4 bg-white p-5 rounded-md  h-fit fixed bottom-20 right-5 z-50 transition-all ease-in-out duration-300  ">
            <div className="flex gap-x-2 border-b-2">
              <img
                src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                alt="Tutor"
                className="w-10 h-10 object-cover rounded-full border"
              />
              <span className="text-xl font-semibold my-auto">
                {tutor.name}
              </span>
            </div>

            {/* Display Messages */}
            <div className="mb-3 h-64 overflow-y-auto p-3 no-scrollbar">
              {loadingMessages ? (
                <p>Loading messages...</p>
              ) : messages.messages ? (
                messages.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      message.senderPhoneNumber === senderPhoneNumber
                        ? "text-right"
                        : ""
                    }`}
                  >
                    <p
                      className={
                        message.senderPhoneNumber === senderPhoneNumber
                          ? "text-green-600"
                          : "text-blue-600"
                      }
                    >
                      {message.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No conversation yet.
                </p>
              )}
            </div>

            {/* Message Input Form */}
            <div>
              <textarea
                placeholder={`Hi, I’m looking for a tutor...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                rows="5"
              ></textarea>
              <button
                onClick={sendMessage}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                Send a message
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Expected response time: 24h
            </p>
          </div>
        )}

        {/* Floating Message Icon */}
        <div
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full cursor-pointer shadow-lg z-50"
          onClick={() => setIsMessageBoxVisible(!isMessageBoxVisible)} // Toggle visibility of the message box
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 3C2.44772 3 2 3.44772 2 4V16C2 16.5523 2.44772 17 3 17H18L23 21V4C23 3.44772 22.5523 3 22 3H3ZM3 1C1.34315 1 0 2.34315 0 4V16C0 17.6569 1.34315 19 3 19H18L23 24V4C23 2.34315 21.6569 1 20 1H3Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TutorDetail;
