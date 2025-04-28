

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Assuming framer-motion

// Placeholder Icons
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>; // Example Alert Icon

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  confirmButtonVariant = "primary"
}) {

  const getConfirmButtonClasses = () => {
    switch (confirmButtonVariant) {
      case 'danger':
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case 'primary':
      default:
        return "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirmModalBackdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" 
          onClick={onClose}
        >
          <motion.div
            key="confirmModalContent"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Optional Close Button */}
            <button
               onClick={onClose}
               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
               aria-label="Close modal"
            >
                <CloseIcon/>
            </button>

            <div className="sm:flex sm:items-start">
                {/* Icon (Optional based on variant) */}
                {confirmButtonVariant === 'danger' && (
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertIcon />
                    </div>
                )}

                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {/* Title */}
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                        {title}
                    </h3>
                    {/* Message */}
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-300">
                           {message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:px-4">
                <button
                    type="button"
                    disabled={isLoading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${getConfirmButtonClasses()}`}
                    onClick={onConfirm}
                >
                    {isLoading ? 'Processing...' : confirmText}
                </button>
                <button
                    type="button"
                    disabled={isLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-30"
                    onClick={onClose}
                >
                    {cancelText}
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmationModal;