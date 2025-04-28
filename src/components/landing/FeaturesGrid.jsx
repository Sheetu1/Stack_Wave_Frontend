
import React from 'react';
import FeatureCard from './FeatureCard';
// Import icons later e.g., from react-icons
// import { FaQuestionCircle, FaCode, FaTrophy, FaRobot } from 'react-icons/fa';

const features = [
  {
    // icon: <FaQuestionCircle size={40} className="text-indigo-500 mb-4" />,
    iconPlaceholder: '💬', // Temporary placeholder
    title: 'Instant Q&A',
    description: 'Get quick answers to your coding roadblocks from the community.',
    link: '/questions', // Optional link
  },
  {
    // icon: <FaCode size={40} className="text-green-500 mb-4" />,
    iconPlaceholder: '👨‍💻', // Temporary placeholder
    title: 'Real-Time Code Rooms',
    description: 'Collaborate live on code with integrated editor and chat features.',
    link: '/room/create', // Optional link
  },
  {
    // icon: <FaTrophy size={40} className="text-yellow-500 mb-4" />,
    iconPlaceholder: '🏆', // Temporary placeholder
    title: 'Leaderboard & Points',
    description: 'Earn reputation points, climb the leaderboard, and showcase your expertise.',
    link: '/leaderboard', // Optional link
  },
  // { // Optional AI Feature
  //   icon: <FaRobot size={40} className="text-purple-500 mb-4" />,
  //   iconPlaceholder: '🤖', // Temporary placeholder
  //   title: 'AI Code Assistant',
  //   description: 'Get AI-powered suggestions and explanations right within the platform.',
  //   link: '#', // Optional link
  // },
];

function FeaturesGrid() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-12">
          Why StackWave?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.iconPlaceholder} // Replace with feature.icon when using real icons
              title={feature.title}
              description={feature.description}
              link={feature.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;