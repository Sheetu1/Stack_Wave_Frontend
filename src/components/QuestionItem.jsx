
import React from 'react';
import { Link } from 'react-router-dom';


const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num;
};


import { formatDistanceToNow } from 'date-fns';

function QuestionItem({ question }) {
  const {
    _id,
    title,
    authorId : author,
    tags,
    votes,
    answersCount,
    createdAt,
  } = question;

  return (
    <div className="flex flex-col sm:flex-row items-start p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 space-x-0 sm:space-x-4">

      {/* Stats Section (Left side on larger screens) */}
      <div className="flex sm:flex-col items-baseline sm:items-end space-x-3 sm:space-x-0 sm:space-y-1 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0 w-full sm:w-24 mb-2 sm:mb-0">
        <div className="text-center min-w-[50px]">
          <span className="font-semibold text-base text-gray-800 dark:text-gray-200">{formatNumber(votes || 0)}</span>
          <span className="block text-xs">votes</span>
        </div>
        <div className="text-center min-w-[50px] p-1 rounded" style={{ backgroundColor: answersCount > 0 ? '#e0f2fe' : 'transparent', color: answersCount > 0 ? '#0284c7' : 'inherit' }}>
          <span className={`font-semibold text-base ${answersCount > 0 ? 'text-sky-700' : 'text-gray-800 dark:text-gray-200'}`}>{formatNumber(answersCount || 0)}</span>
          <span className="block text-xs">answers</span>
        </div>
      </div>

      {/* Main Content Section (Title, Tags, Author) */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-1.5 leading-snug">
          <Link to={`/question/${_id}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags?.map((tag) => (
            <div key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-2 py-0.5 transition-colors">
              {tag}
            </div>
          ))}
        </div>

       
        <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 space-x-1 mt-1">
          <Link to={`/profile/${author?._id}`} className="flex items-center space-x-1 hover:opacity-80">
            <img
                className="h-5 w-5 rounded object-cover"
                src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.username || 'A'}&size=20&background=random`}
                alt={author?.username || 'Author'}
            />
            <span className="text-indigo-700 dark:text-indigo-400 font-medium">{author?.username || 'Unknown User'}</span>
          </Link>
          <span>
            asked {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'recently'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuestionItem;