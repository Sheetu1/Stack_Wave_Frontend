
import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 dark:from-gray-800 to-white dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        {/* Logo (Optional if already in Navbar) */}
        {/* <img src="/path/to/stackwave-logo.png" alt="StackWave Logo" className="h-12 w-auto mx-auto mb-4" /> */}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          Ask. Answer. <span className="text-indigo-600 dark:text-indigo-400">Collaborate Live.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
          StackWave is your real-time platform to get coding help, share knowledge, and build projects together with fellow developers. Instantly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg transition duration-150 ease-in-out transform hover:scale-105">
            Join Now
          </Link>
          <Link
            to="/questions"
            className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-md text-lg font-semibold shadow transition duration-150 ease-in-out">
            Browse Questions
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;