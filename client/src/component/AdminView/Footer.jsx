import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  useEffect(() => {
    // Ensure theme persists on refresh
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <div>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <a href="#" className="flex ms-2 md:me-24">
                <img
                  src="https://flowbite.com/docs/images/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Flowbite
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user"
                  />
                </button>
                {isDropdownOpen && (
                  <div className="z-50 absolute right-0 top-9 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        Neil Sims
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                        neil.sims@flowbite.com
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={toggleDarkMode}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white w-full"
                        >
                          {isDarkMode ? (
                            <>
                              <svg
                                className="w-5 h-5 me-2"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M17.75 21.994c-4.442.001-8.308-3.59-8.757-8.035-.047-.418.29-.959.742-.967.052-.001.106-.002.158-.002 2.761 0 5.413-1.601 6.593-4.067.357-.731-.113-1.469-.968-1.47-5.005-.009-9.113 3.94-9.115 8.778-.002 4.937 4.248 8.84 9.375 8.763.567-.007 1.083-.271 1.285-.73.297-.662-.003-1.527-.412-1.68-.313-.114-.64-.109-.921-.058z"></path>
                              </svg>
                              Light Mode
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5 me-2"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 3a1 1 0 110 2 7 7 0 100 14 1 1 0 110 2 9 9 0 110-18z"></path>
                              </svg>
                              Dark Mode
                            </>
                          )}
                        </button>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          Sign out
                        </a>
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li className="mb-1">
              <Link
                to=''
                className="flex items-center p-2 text-black rounded-lg  hover:bg-red-800 hover:text-white dark:bg-white dark:hover:bg-gray-300 dark:text-black group"
              >
                <svg
                  className="w-5 h-6 text-black transition duration-75 hover:bg-red-800  dark:text-black dark:hover:bg-gray-300"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.97a1 1 0 0 0-.334-.662 7.005 7.005 0 0 0-6.83-4.277A1 1 0 0 0 12.5 0z" />
                </svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
          
            <li className="mb-1">
              <Link
                to=''
                className="flex items-center p-2 text-black rounded-lg  hover:bg-red-800 hover:text-white dark:bg-white dark:hover:bg-gray-300 dark:text-black group"
              >
                <svg
                  className="w-5 h-6 text-black transition duration-75 hover:bg-red-800  dark:text-black dark:hover:bg-gray-300"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.97a1 1 0 0 0-.334-.662 7.005 7.005 0 0 0-6.83-4.277A1 1 0 0 0 12.5 0z" />
                </svg>
                <span className="ml-3">Tutors</span>
              </Link>
            </li>
            <li className="mb-1">
              <Link
                to=''
                className="flex items-center p-2 text-black rounded-lg  hover:bg-red-800 hover:text-white dark:bg-white dark:hover:bg-gray-300 dark:text-black group"
              >
                <svg
                  className="w-5 h-6 text-black transition duration-75 hover:bg-red-800  dark:text-black dark:hover:bg-gray-300"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.97a1 1 0 0 0-.334-.662 7.005 7.005 0 0 0-6.83-4.277A1 1 0 0 0 12.5 0z" />
                </svg>
                <span className="ml-3">Parents</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Footer;
