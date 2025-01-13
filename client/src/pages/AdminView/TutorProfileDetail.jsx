import { useParams } from "react-router-dom";
import { useEffect, useRef,useState } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
const TutorProfileDetail = () => {
  const { user } = useSelector((state) => state.auth);  // Access user from Redux 

  const [dropdownVisible, setDropdownVisible] = useState({});
  const dropdownRefs = useRef({});
  const { tutorId } = useParams();
  const [tutor, setTutor] = useState(null);
  const [tutorPhoneNumber, setTutorPhoneNumber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  
 



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
      Sun: "Sunday",
    };
  
    // Check if tutor is available on the given day and within the time range
    return tutor.availability.some((item) => {
      // Match the day
      if (item.day !== dayMapping[day]) return false;
  
      // Check if the time range matches exactly
      return item.time === timeRange;
    });
  };


  const handleClickOutside = (event) => {
    for (const key in dropdownRefs.current) {
      if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
        setDropdownVisible((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Fetch Tutor details
  useEffect(() => {
    
    const fetchTutorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/${tutorId}`);
        
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
      const response = await axios.get(`http://localhost:5000/api/reviews/tutor/${tutorId}`);
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
    reviews.reduce((total, review) => total + review.rating, 0) / reviews.length || 0
  ).toFixed(1);
  
  const handleSeeMoreReviews = () => {
    setVisibleReviews((prevVisible) => prevVisible + 4); // Increment by 4
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/userReviewsByAdmin/${id}`);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  
   const handleEditReview = (review) => {
    setEditingReview(review); // Set the review to be edited
    setEditModalVisible(true); // Show the modal
  };

  const handleSaveEditedReview = async () => {
   const id = editingReview.id
    try {
        console.log("id",id)
      const response = await axios.put(
        `http://localhost:5000/api/admin/userReviewsByAdmin/${id}`,
        {  comment: editingReview.comment }
      );
       fetchReviews();
      setEditModalVisible(false); // Hide the modal
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } 
  };

  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-5 lg:flex gap-10">
      {/* LEFT COLUMN: Tutor Details */}
      <div className="lg:w-3/4 bg-white p-5 rounded-md shadow-md">
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
          <p className="text-gray-700 mt-2">{tutor.about}</p>
        </div>

        {/* Ratings and Reviews */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Ratings & Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold">{averageRating}</span>
            <div className="text-yellow-400">
              {"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span className="text-gray-500">{`${reviews.length} review(s)`}</span>
          </div>
          <div className="mt-3">
  {reviews.slice(0, visibleReviews).map((review) => (
    <div key={review.id} className="border-b pb-3 mb-3 relative">
      <div className="flex items-center gap-3">
        <img
          src={review.parent.profilePicture || "https://via.placeholder.com/50"}
          alt={review.parent.name}
          className="w-12 h-12 object-cover rounded-full border"
        />
        <div>
          <p className="font-semibold">{review.parent.name}</p>
          <div className="text-yellow-400">
            {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
          </div>
        </div>
        {/* Dropdown Menu Trigger */}
        <div className="ml-auto relative -top-5">
          <button
            className="p-2 rounded-full "
            onClick={() => setDropdownVisible((prev) => ({
              ...prev,
              [review.id]: !prev[review.id],
            }))}
          >
            <span className="text-xl font-extrabold">...</span> {/* Ellipsis here */}
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible[review.id] && (
            <div
            ref={(el) => (dropdownRefs.current[review.id] = el)}
            className="absolute right-0 top-full mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-500"
                onClick={() => handleEditReview(review)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-gray-700 mt-2">{review.comment}</p>
    </div>
  ))}
</div>
        </div>
        {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>
            <textarea
              value={editingReview.comment}
              onChange={(e) =>
                setEditingReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="4"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveEditedReview}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditModalVisible(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        


        {/* Qualifications */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Qualifications</h2>
          {tutor.qualifications}
        </div>
{/* Certifications Section */}


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



export default TutorProfileDetail


// {tutor.certifications && tutor.certifications.length > 0 && (
//     <div className="mt-5">
//       <h2 className="text-xl font-semibold">Certifications</h2>
//       <ul className="mt-3">
//         {tutor.certifications.map((certificate, index) => (
//           <li key={index} className="mb-2">
//             {/* Display image preview if it's an image file */}
//             <a 
//               href={`${BASE_URL_IMAGE}uploads/${certificate}`} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="text-blue-600 underline"
//             >
//               {/* Show image as thumbnail for certificates */}
//               <img 
//                 src={`${BASE_URL_IMAGE}uploads/${certificate}`} 
//                 alt={`Certification ${index + 1}`} 
//                 className="w-16 h-16 object-cover border rounded"
//               />
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )}