import axios from "axios";
import React, { useState, useEffect } from "react";

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function TutorVerification() {
  const [unverifiedTutor, setUnverifiedTutor] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const itemsPerPage = 8;

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/getUnverifiedTutors/${id}`
      );
      setSelectedTutor(response.data?.tutor);
      setPopupIsOpen(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch tutor details");
    }
  };

  const closePopup = () => {
    setPopupIsOpen(false);
    setSelectedTutor(null);
  };

  const fetchUnverifiedTutor = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/unverified-tutors"
      );
      setUnverifiedTutor(response.data.unverifiedTutors);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchUnverifiedTutor();
  }, []);

  const handleApprove = async (id) => {
  
    try {
      await axios.post(`http://localhost:5000/api/admin/approve-tutor/${id}`);
      alert("Tutor approved successfully!");
      fetchUnverifiedTutor(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve tutor");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(unverifiedTutor.length / itemsPerPage);
  const currentData = unverifiedTutor.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  console.log(selectedTutor);
  return (
    <div>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Unverified Tutors
            </h2>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tutor
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Qualification
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      View Detail
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((tutor) => (
                      <tr key={tutor.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img
                                className="w-full h-full rounded-full"
                                src={`${BASE_URL_IMAGE}uploads/${tutor.profilePicture}`}
                                alt={tutor.name}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {tutor.name}
                              </p>
                              <p className="text-gray-600 whitespace-no-wrap">
                                {tutor.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {tutor.city}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {tutor.qualifications}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <button
                              onClick={() => handleViewDetails(tutor.id)}
                              className="relative"
                            >
                              View Detail
                            </button>
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button
                            onClick={() => handleApprove(tutor.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                      >
                        No unverified tutors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {popupIsOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl h-10/12 overflow-y-auto">
                    {selectedTutor ? (
                      <div>
                        {/* Header Section */}
                        <div className="text-center mb-6">
                          <img
                            src={selectedTutor.profilePicture}
                            alt={`${selectedTutor.name}'s profile`}
                            className="w-24 h-24 mx-auto rounded-full shadow-lg"
                          />
                          <h2 className="text-2xl font-bold mt-3">
                            {selectedTutor.name}
                          </h2>
                          <p className="text-gray-700">{selectedTutor.email}</p>
                        </div>

                        {/* Grid Section */}
                        <div className="grid grid-cols-3 gap-6">
                          {/* Column 1 */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Basic Info
                            </h3>
                            <p>
                              <span className="font-semibold">City:</span>{" "}
                              {selectedTutor.city}
                            </p>
                            <p>
                              <span className="font-semibold">Gender:</span>{" "}
                              {selectedTutor.gender}
                            </p>
                            <p>
                              <span className="font-semibold">Postcode:</span>{" "}
                              {selectedTutor.postcode}
                            </p>
                            <p>
                              <span className="font-semibold">Phone:</span>{" "}
                              {selectedTutor.phoneNumber}
                            </p>
                          </div>

                          {/* Column 2 */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Professional Details
                            </h3>
                            <p>
                              <span className="font-semibold">
                                Qualifications:
                              </span>{" "}
                              {selectedTutor.qualifications}
                            </p>
                            <p>
                              <span className="font-semibold">
                                Teaching Experience:
                              </span>{" "}
                              {selectedTutor.teachingExperience} years
                            </p>
                            <p>
                              <span className="font-semibold">
                                Hourly Rates:
                              </span>{" "}
                              ${selectedTutor.hourlyRates}
                            </p>
                            <h3 className="text-lg font-semibold mb-2 mt-4">
                              Subjects Taught:
                            </h3>
                            <ul className="list-disc list-inside text-gray-700">
                              {selectedTutor.subjectsTaught.map(
                                (subject, index) => (
                                  <li key={index}>{subject}</li>
                                )
                              )}
                            </ul>
                          </div>

                          {/* Column 3 */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">
                              Additional Details
                            </h3>
                            <h4 className="text-md font-semibold mt-2">
                              Grades Handled:
                            </h4>
                            <ul className="list-disc list-inside text-gray-700">
                              {selectedTutor.gradesHandled.map(
                                (grade, index) => (
                                  <li key={index}>{grade}</li>
                                )
                              )}
                            </ul>
                            <h4 className="text-md font-semibold mt-4">
                              Availability:
                            </h4>
                            <ul className="list-disc list-inside text-gray-700">
                              {selectedTutor.availability.map((slot, index) => (
                                <li key={index}>
                                  {slot.day} at {slot.time}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Certifications */}
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">
                            Certifications:
                          </h3>
                          {selectedTutor.certifications.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                              {selectedTutor.certifications.map(
                                (cert, index) => (
                                  <a
                                    key={index}
                                    href={cert}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={cert}
                                      alt={`Certification ${index + 1}`}
                                      className="h-32 w-32 rounded shadow-lg object-cover"
                                    />
                                  </a>
                                )
                              )}
                            </div>
                          ) : (
                            <p>No certifications available.</p>
                          )}
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={closePopup}
                          className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full"
                        >
                          Close
                        </button>
                      </div>
                    ) : (
                      <p>Loading details...</p>
                    )}
                  </div>
                </div>
              )}

              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing {currentData.length} of {unverifiedTutor.length}{" "}
                  Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorVerification;
