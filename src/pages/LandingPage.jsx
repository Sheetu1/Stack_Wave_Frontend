
import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import LivePreviewSection from '../components/landing/LivePreviewSection';
import CtaBanner from '../components/landing/CtaBanner';
import Footer from '../components/landing/Footer';
import Navbar from '../components/landing/Navbar';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesGrid />
        <LivePreviewSection /> {/* Optional section */}
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;