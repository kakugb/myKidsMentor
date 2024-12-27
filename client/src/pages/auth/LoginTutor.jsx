import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { login } from "../../../store/authSlice.js";
import DealBabaImg from '../../assets/DealBabaimg.png'
function LoginTutor() {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
   
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedIsAuthenticated && storedUser) {
      dispatch(login(storedUser));
      navigate(`/${storedUser.role}/dashboard`);  
    }
  }, [dispatch, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      setLoading(false);

      const { user, token } = response.data;

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      dispatch(login(user));

      navigate('/tutor/dashboard');
    } catch (error) {
      console.log(error)
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (

<div class="bg-gray-100 flex justify-center items-center h-screen">

<div class="w-1/2 h-screen hidden lg:block">
  <img src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat" alt="Placeholder Image" class="object-cover w-full h-full"/>
</div>

<div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <h1 class="text-2xl font-semibold mb-4">Login</h1>
  <form onSubmit={handleLogin}>

    <div class="mb-4">
      <label for="username" class="block text-gray-600">Username</label>
      <input 
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"/>
    </div>

    <div class="mb-4">
      <label for="password" class="block text-gray-600">Password</label>
      <input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
      
      class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autocomplete="off"/>
    </div>

    {/* <div class="mb-4 flex items-center">
      <input type="checkbox" id="remember" name="remember" class="text-blue-500"/>
      <label for="remember" class="text-gray-600 ml-2">Remember Me</label>
    </div> */}
    {/* <div class="mb-6 text-blue-500">
      <a href="#" class="hover:underline">Forgot Password?</a>
    </div> */}

    <button 
    type="submit"
    disabled={loading}
    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>

  <div class="mt-6 text-blue-500 text-center">
    <Link to='/tutor/Register' class="hover:underline">Registered as Tutor</Link>
  </div>
</div>
</div>
  );
}

export default LoginTutor;
