
import React from 'react';
import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion'; // Import later for animations

function LivePreviewSection() {
  // Replace with actual image/video/component later
  return (
    <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
          See it in Action!
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-10">
          Experience seamless real-time code editing and chat. Perfect for pair programming, interviews, or teaching.
        </p>
        {/* Placeholder for image/video */}
        {/* Add Framer Motion here later for fade-in effect */}
        {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}> */}
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden aspect-video max-w-4xl mx-auto">
            {/* Example: Placeholder image */}
            <img
              src="https://placehold.co/1200x675/e2e8f0/64748b?text=Live+Editor+Preview" // Replace with your actual preview image/video
              alt="Live Code Editor Preview"
              className="w-full h-full object-cover"
            />
            {/* Or embed a video */}
            {/* <video className="w-full h-full" controls> <source src="/path/to/preview.mp4" type="video/mp4" /> </video> */}
          </div>
        {/* </motion.div> */}
        {/* Optional CTA specific to this section */}
         <div className="mt-12">
            <Link
              to="/room/create" // Or signup
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
            >
              Try the Demo Room
            </Link>
          </div>
      </div>
    </section>
  );
}

export default LivePreviewSection;