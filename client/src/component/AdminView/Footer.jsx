import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.js";
import logo from "../../assests/Logo.svg";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;

function Footer() {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", "false");
    dispatch(logout());
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/tutorVerfication"
              className="flex items-center gap-x-2 text-teal-700"
            >
              <img alt="Logo" src={logo} className="h-10 w-auto" />
              <h1 className="hidden sm:flex items-center text-2xl font-bold">
                Mykids Mentor
              </h1>
            </Link>

            <div className="flex items-center gap-x-4">
              <button
                onClick={toggleSidebar}
                className="sm:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="w-6 h-6 text-teal-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <span className="hidden sm:block font-semibold uppercase">
                {user?.name}
              </span>

              <button
                onClick={toggleDropdown}
                className="flex items-center p-2 rounded-full bg-gray-800 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <img
                  alt="User"
                  src={`${BASE_URL_IMAGE}uploads/${user?.profile_picture}`}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-12 right-4 z-50 bg-white rounded shadow dark:bg-gray-700">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      {user?.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/admin/tutorVerfication"
                className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.03 2 11c0 2.843 1.389 5.436 3.633 7.165l-.91 3.64a1 1 0 0 0 1.307 1.178l4.09-1.636A9.87 9.87 0 0 0 12 20c5.523 0 10-4.03 10-9s-4.477-9-10-9z" />
                </svg>
                <span className="ml-3">Tutor Verification</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.03 2 11c0 2.843 1.389 5.436 3.633 7.165l-.91 3.64a1 1 0 0 0 1.307 1.178l4.09-1.636A9.87 9.87 0 0 0 12 20c5.523 0 10-4.03 10-9s-4.477-9-10-9z" />
                </svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Footer;
