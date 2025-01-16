import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa"; // Import a trash icon from react-icons

const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

const AddDocuments = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = React.createRef();
  const tutor = useSelector((state) => state.auth.user);
  const tutorId = tutor?.id;

  // Fetch existing certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tutor/getCertificates/${tutorId}`
        );
        setCertificates(response.data.certifications || []);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates.");
      }
    };

    fetchCertificates();
  }, [tutorId]);

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
    setSuccess("");
    
  };

  // Handle certificate upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("certifications", selectedFile);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tutor/addcertificate/${tutorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCertificates(response.data.certifications);
      setSuccess("Certificate uploaded successfully!");
      setError("");
      setSelectedFile(null);
      setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input field
    }
    } catch (err) {
      console.error("Error uploading certificate:", err);
      setError("Failed to upload certificate.");
      setSuccess("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input field
      }
    }
  };

// Handle delete certificate
const handleDelete = async (certificate) => {
  if (!window.confirm("Are you sure you want to delete this certificate?")) {
    return;
  }

  try {
    // Make DELETE request with the certificate to delete
    const response = await axios.delete(
      `http://localhost:5000/api/tutor/deleteCertificate/${tutorId}`,
      { data: { certificate } } // Pass the certificate to delete
    );

    // Update state with the remaining certificates
    setCertificates(response.data.certifications);
    setSuccess("Certificate deleted successfully!");
    setError("");
  } catch (err) {
    console.error("Error deleting certificate:", err);
    setError("Failed to delete certificate.");
    setSuccess("");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Tutor Certificates</h1>

      {/* Upload Certificate Form */}
      <form onSubmit={handleUpload} className="mb-6">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-600"
          >
            Upload
          </button>
        </div>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* List of Certificates */}
      <h2 className="text-xl font-semibold mb-4">Uploaded Certificates</h2>
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {certificates.map((certificate, index) => {
            const fileUrl = `${BASE_URL_IMAGE}uploads/${certificate}`;

            return (
              <div
                key={index}
                className="relative group border border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-md"
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(certificate)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>

                {/* Check file type */}
                {/\.(jpg|jpeg|png|gif)$/i.test(certificate) ? (
                  <img
                    src={fileUrl}
                    alt={certificate}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-700">View Document</p>
                  </div>
                  
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No certificates uploaded yet.</p>
      )}
    </div>
  );
};

export default AddDocuments;
