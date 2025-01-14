import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import parentRegister from '../../assests/parentLogin.jpeg'
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: null, // File type
    role: 'parent', // Default role
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0], // Handle file input
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Registration successful!');
        // Optional: Redirect to login page
      } else {
        alert('Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center font-[sans-serif] bg-rose-50 lg:h-screen p-6">
        <div className="grid md:grid-cols-2 items-center gap-y-8 bg-white max-w-7xl w-full shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md overflow-hidden">
          <div className="w-full h-full">
            <img
              src={parentRegister}
              alt="Register illustration"
              className="w-full h-full"
            />
          </div>

          <form onSubmit={handleSubmit} className="sm:p-8 p-4 w-full">
            <div className="mb-12">
              <h3 className="text-black text-4xl font-bold text-center">Parent Registeration</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-800 text-sm mb-2 block">First Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter Email Address"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="*****************"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Profile Picture</label>
                <input
                  name="profilePicture"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="py-3 px-6 text-sm tracking-wide font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-all"
              >
                Sign up
              </button>
              <p className="flex justify-end text-sm text-blue-600 font-semibold">
                Already registered?
                <Link
                  to="/loginParent"
                  className="ml-1 hover:text-blue-600 hover:underline hover:underline-offset-4"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
