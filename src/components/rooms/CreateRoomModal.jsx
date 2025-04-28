
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


function CreateRoomModal({ isOpen, onClose, onCreate, isLoading, error, clearError }) {
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');

  // Clear local error when modal opens or external error changes
  useEffect(() => {
      if (isOpen && clearError) {
          clearError();
      }
  }, [isOpen, error, clearError]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (onCreate) {
      onCreate({ roomName, language });
    }
  };

  // List of supported languages (adjust as needed)
  const supportedLanguages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },

    { value: 'c', label: 'C language' },
    { value: 'c++', label: 'C++' },
    { value: 'go', label: 'GO' },

    { value: 'kotlin', label: 'Kotlin' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },

    { value: 'swift', label: 'Swift' },
    { value: 'sql', label: 'SQL-(Lite)' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="createRoomBackdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="createRoomContent"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()} // Prevent close on content click
          >
            {/* Close Button */}
            <button
               onClick={onClose}
               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
               aria-label="Close modal"
            >
                <CloseIcon/>
            </button>

            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
              Create a New Collaboration Room
            </h3>

            {/* Display Error within Modal */}
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm" role="alert">
                  {error}
                </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room Name Input (Optional) */}
              <div>
                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Name (Optional)
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., Project Alpha Session"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Language Selection */}
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {supportedLanguages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Room'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateRoomModal;