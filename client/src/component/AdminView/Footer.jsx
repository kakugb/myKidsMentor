import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.js";
import logo from "../../assests/Logo.svg";
const BASE_URL_IMAGE = import.meta.env.VITE_MY_KIDS_MENTOR_IMAGE_URL;
function Footer() {
  const { user } = useSelector((state) => state.auth);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const dispatch = useDispatch();
  const handleLogout = () => {
    console.log("Logging out...");

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
            <div className="flex lg:flex-1">
              <Link
                to="/parent/dashboard"
                className="-m-1.5 p-1.5 flex gap-x-2 text-teal-700"
              >
                <img alt="" src={logo} className="h-20 w-auto" />
                <h1 className="hidden sm:flex items-center text-2xl font-bold">
                  Mykids Mentor
                </h1>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-x-4 ms-3 relative">
              <span className="font-semibold uppercase">{user?.name}</span>
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  
              <img
                alt=""
                src={`${BASE_URL_IMAGE}uploads/${user?.profile_picture}`}
                className="size-10 rounded-full"
              />
                </button>
                {isDropdownOpen && (
                  <div className="z-50 absolute right-0 top-12 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3">
                      
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                        {user?.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
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
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-32 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li className="mb-1">
              <Link
                to="/admin/tutorVerfication"
                className="flex items-center p-2 text-black rounded-lg  hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-black transition duration-75 hover:bg-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2a1 1 0 01.894.553l1.618 3.275 3.618.525a1 1 0 01.555 1.705l-2.618 2.553.618 3.606a1 1 0 01-1.45 1.054L12 13.827l-3.239 1.703a1 1 0 01-1.45-1.054l.618-3.606-2.618-2.553a1 1 0 01.555-1.705l3.618-.525L11.106 2.553A1 1 0 0112 2zM12 6.27L10.327 9.636l-3.914.569 2.832 2.764-.668 3.892L12 14.37l3.423 1.791-.668-3.892 2.832-2.764-3.914-.569L12 6.27zM20 22H4a1 1 0 01-1-1v-2a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1zm-1-2H5v1h14v-1z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="ml-3">Tutor Verification</span>
              </Link>
            </li>

            <li className="mb-1">
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 text-black rounded-lg  hover:bg-gray-100 "
              >
                <svg
                  className="w-6 h-6 text-black transition duration-75 hover:bg-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.477 2 2 6.03 2 11c0 2.843 1.389 5.436 3.633 7.165l-.91 3.64a1 1 0 0 0 1.307 1.178l4.09-1.636A9.87 9.87 0 0 0 12 20c5.523 0 10-4.03 10-9s-4.477-9-10-9z" />
                  <path d="M14.243 10.757a1 1 0 0 0-1.414-1.414L10 12.172l-1.829-1.829a1 1 0 0 0-1.414 1.414L8.586 13.5l-2.121 2.121a1 1 0 0 0 1.414 1.414L10 14.828l2.829 2.829a1 1 0 0 0 1.414-1.414L11.414 13.5l2.829-2.829z" />
                </svg>

                <span className="ml-3">Review Moderation</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Footer;
