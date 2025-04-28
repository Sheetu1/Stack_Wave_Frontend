
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import AuthModal from '../components/AuthModal';


function BodyLayout({ isAuthenticated }) {

  if (!isAuthenticated) {
    return <AuthModal isOpen={true} onClose={() => { }} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50 h-20 flex items-center justify-center">
        <Navbar/>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
        StackWave App Footer © 2024
      </footer>
    </div>
  );
}

export default BodyLayout;
