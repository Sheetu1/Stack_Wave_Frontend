
import React from 'react';
import { Link } from 'react-router-dom'; // Use Link if cards should navigate

function FeatureCard({ icon, title, description, link }) {
  const cardContent = (
    <>
      {/* Replace div with icon component when ready */}
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-base">{description}</p>
    </>
  );

  // Decide if the whole card is a link or just has text
  const CardWrapper = link ? Link : 'div';

  return (
    <CardWrapper
      to={link} // This prop is only used if CardWrapper is Link
      className="block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out text-center"
    >
      {cardContent}
    </CardWrapper>
  );
}

export default FeatureCard;