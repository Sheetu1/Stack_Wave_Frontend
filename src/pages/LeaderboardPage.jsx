

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Or your API service
import { BASE_URL } from '../utils/constants';
import Loading from '../components/Loading';


// Placeholder Icons
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-2 text-yellow-500"><path fillRule="evenodd" d="M15.445 5.555a.75.75 0 01.27 1.03l-4.125 6.875a.75.75 0 01-1.18.06l-2.125-2.834a.75.75 0 111.24-.93l1.49 1.987 3.58-5.967a.75.75 0 011.03-.27zm-.33 2.046a.75.75 0 01.36-.98l3-1.5a.75.75 0 01.98.98l-1.5 3a.75.75 0 01-.98.36l-3-1.5a.75.75 0 01-.36-.98zm-8.13 0a.75.75 0 01-.36-.98l-3-1.5a.75.75 0 11.98-.98l1.5 3a.75.75 0 01-.36.98l-1.5 3a.75.75 0 01-.98-.98l3-1.5zM10 2.5a.75.75 0 01.75.75v.047l.01 2.953c.781.15 1.5.44 2.105.865a.75.75 0 01-.89 1.313 6.647 6.647 0 00-1.215-.43V2.5A.75.75 0 0110 1.75zm-1.5 5.618a6.647 6.647 0 00-1.215.43.75.75 0 11-.89-1.312c.605-.426 1.324-.716 2.105-.865l.01-2.953V3.25a.75.75 0 11-1.5 0V2.5zm5.69-.471a.75.75 0 10-.89 1.313 8.155 8.155 0 013.45 6.158.75.75 0 101.49-.173 9.655 9.655 0 00-4.05-7.298zM4.66 7.647a.75.75 0 10-.89-1.313A9.655 9.655 0 00-.28 12.63a.75.75 0 101.49.174 8.155 8.155 0 013.45-6.157z" clipRule="evenodd" /></svg>;


function LeaderboardPage() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(6);

    const { user: loggedInUser, token } = useSelector(state => state.user);


    const fetchLeaderboard = useCallback(async (page, range) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                range: range,
            });

            const response = await axios.get(`${BASE_URL}/api/leaderboard?${params.toString()}`,{
              headers: {Authorization: `bearer ${token}`}
            });

            setLeaderboardData(response.data?.data || []);

        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError("Could not load leaderboard data.");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    
    useEffect(() => {
        fetchLeaderboard(currentPage, timeRange);
    }, [currentPage, timeRange, fetchLeaderboard]);

    const handleTimeRangeChange = (newRange) => {
        if (newRange !== timeRange) {
            setTimeRange(newRange);
            setCurrentPage(1);
        }
    };
    

    const handlePrev = () => {
      if(currentPage > 1){
        setCurrentPage(prev => prev - 1)
      }
    }
  
    const handleNext = () => {
      if(leaderboardData.length > 1){
        setCurrentPage(prev => prev + 1)
      }
    }

    // Helper to get rank based on page and index
    const getRank = (index) => {
        return (currentPage - 1) * limit + index + 1;
    };


    // Button component for time range filter
    const TimeRangeButton = ({ rangeValue, rangeLabel }) => (
        <button
           onClick={() => handleTimeRangeChange(rangeValue)}
           className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
             timeRange === rangeValue
               ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
               : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
           }`}
        >
           {rangeLabel}
        </button>
     );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <TrophyIcon /> Top Contributors
                 </h1>
                 {/* Time Range Filters */}
                 <div className="flex space-x-1 sm:space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1 bg-white dark:bg-gray-800 shadow-sm">
                     <TimeRangeButton rangeValue="all" rangeLabel="All Time" />
                     <TimeRangeButton rangeValue="month" rangeLabel="This Month" />
                     <TimeRangeButton rangeValue="week" rangeLabel="This Week" />
                 </div>
            </div>

            {/* Leaderboard List Area */}
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {loading && <div className="p-10 text-center text-gray-500"> <Loading/> </div>}
                {error && <div className="p-10 text-center text-red-600 bg-red-50 dark:bg-red-900/20">Error: {error}</div>}

                {!loading && !error && leaderboardData.length === 0 && (
                    <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                       No contributors found for this period.
                    </div>
                )}

                {!loading && !error && leaderboardData.length > 0 && (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {leaderboardData.map((user, index) => {
                             const rank = getRank(index);
                             const isCurrentUser = loggedInUser?._id === user._id;
                             return (
                                <li
                                    key={user._id}
                                    className={`flex items-center justify-between px-4 py-3 sm:px-6 transition-colors duration-100 ${isCurrentUser ? 'bg-indigo-50 dark:bg-gray-700/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'}`}
                                >
                                   <div className="flex items-center space-x-3 sm:space-x-4 min-w-0"> {/* Added min-w-0 */}
                                       {/* Rank */}
                                       <span className={`text-sm font-bold w-6 text-center ${
                                            rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-yellow-600' : 'text-gray-400 dark:text-gray-500'
                                        }`}>
                                            #{rank}
                                        </span>
                                        
                                        <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                                           <img
                                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                                              src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                              alt={user.username}
                                           />
                                        </Link>
                          
                                        <Link to={`/profile/${user._id}`} className="min-w-0"> {/* Added min-w-0 */}
                                           <p className="text-sm font-medium text-gray-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                                              {user.username}
                                           </p>
                                           
                                           <p className="text-xs text-gray-500 dark:text-gray-400">Badge Icons</p>
                                        </Link>
                                   </div>
                                    
                                    <div className="flex-shrink-0 ml-4">
                                        <span className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                            {user.reputation || 0} pts
                                        </span>
                                    </div>
                                </li>
                             );
                        })}
                    </ul>
                )}
             </div>

             {/* Pagination Area */}
             {!loading && !error && (
                <div className="join flex items-center justify-center">
                  <button onClick={handlePrev} className="join-item btn">«</button>
                  <button className="join-item btn">Page {currentPage}</button>
                  <button onClick={handleNext} className="join-item btn">»</button>
                </div>
             )}

        </div>
    );
}

export default LeaderboardPage;