
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';


function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleBackdropClick = () => {
    // Decide if clicking backdrop should do anything
    // Option 1: Do nothing, force user to click Login/Signup
    // Option 2: Close the modal (if onClose prop does something)
    // Option 3: Navigate to landing page
    // navigate('/'); 
    if (onClose) {
      onClose();
    }
  };

  return (
    // AnimatePresence allows the exit animation
    <AnimatePresence>
      {isOpen && (
        // Backdrop
        <motion.div
          key="authModalBackdrop" // Added key for AnimatePresence
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={handleBackdropClick} // Handle click on backdrop
        >
          {/* Modal Content */}
          <motion.div
            key="authModalContent" // Added key for AnimatePresence
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
          >
            {/* Optional: Maybe an icon */}
            {/* <div className="mx-auto mb-4 text-indigo-500"> <svg>...</svg> </div> */}

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
              Access Restricted
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
              You need to be logged in to view this page. Please log in or create an account.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                className="w-full px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="w-full px-5 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Sign Up
              </Link>
            </div>

            {/* Optional: Link back to landing page */}
             <div className="mt-6 text-center">
                <Link to="/" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                  Go back to Homepage
                </Link>
             </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;