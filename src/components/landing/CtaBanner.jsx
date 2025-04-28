
import React from 'react';
import { Link } from 'react-router-dom';

function CtaBanner() {
  return (
    <section className="bg-indigo-700 dark:bg-indigo-800">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
          Ready to level up your dev journey?
        </h2>
        <p className="text-lg text-indigo-100 dark:text-indigo-200 mb-8">
          Join the StackWave community today. Ask, answer, collaborate, and grow together.
        </p>
        <Link
          to="/signup" // Or maybe /room/create depending on focus
          className="inline-block bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-semibold shadow-md transition duration-150 ease-in-out transform hover:scale-105"
        >
          Start Exploring →
        </Link>
      </div>
    </section>
  );
}

export default CtaBanner;