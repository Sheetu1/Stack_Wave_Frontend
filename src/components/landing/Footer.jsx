
import React from 'react';
import { Link } from 'react-router-dom';
// Import social icons later
// import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-6">
            <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">GitHub</a>
            <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</Link>
            <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link>
          </div>

          {/* Social Icons (Placeholders) */}
          <div className="flex justify-center space-x-6">
             <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"> {/* Replace with FaGithub */}
               <span className="sr-only">GitHub</span> GH {/* Icon Placeholder */}
             </a>
             <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"> {/* Replace with FaTwitter */}
               <span className="sr-only">Twitter</span> TW {/* Icon Placeholder */}
             </a>
             {/* Add more social links as needed */}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} StackWave. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;