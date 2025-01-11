import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AddDocuments = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const tutor = useSelector((state) => state.auth.user);
  const tutorId = tutor?.id
  // Fetch existing certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutors/${tutorId}/certificates`);
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
      setSelectedFile(null); // Clear the file input
    } catch (err) {
      console.error("Error uploading certificate:", err);
      setError("Failed to upload certificate.");
      setSuccess("");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Tutor Certificates</h1>

      {/* Upload Certificate Form */}
      <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
        <label>
          Add New Certificate:
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              marginLeft: "10px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* List of Certificates */}
      <h2>Uploaded Certificates:</h2>
      {certificates.length > 0 ? (
        <ul>
          {certificates.map((certificate, index) => (
            <li key={index}>
              <a href={`http://localhost:5000/uploads/certifications/${certificate}`} target="_blank" rel="noopener noreferrer">
                {certificate}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No certificates uploaded yet.</p>
      )}
    </div>
  );
};

export default AddDocuments;
