
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {  FaQuestionCircle, FaPencilAlt, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { toast } from 'react-toastify';

const PlaceholderIcon = ({ className = "w-8 h-8" }) => <div className={`bg-gray-300 dark:bg-gray-600 rounded ${className}`}></div>;
const UserAvatar = ({ src, alt, size = "w-8 h-8" }) => <img className={`rounded-full object-cover ${size}`} src={src} alt={alt} />;
const CrownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.463 3.38.82 4.646 4.28 2.147 2.451 4.305c.216.38.74.38.956 0l2.451-4.305 4.28-2.147.82-4.646-3.463-3.38-4.753-.39-1.83-4.401zM10 14.118a4.118 4.118 0 100-8.236 4.118 4.118 0 000 8.236z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;


function Dashboard() {
  const { user, token } = useSelector(state => state.user);
  const [leaderboard, setLeaderBoard] = useState([]);


  useEffect(() => {
    axios.get(BASE_URL + `/api/leaderboard?limit=5`,{
      headers: { Authorization: `bearer ${token}` }
    })
    .then((res) => {
      setLeaderBoard(res.data.data);
    })
    .catch((err) => {
      toast.error(err.response?.data?.message || "something went wrong")
    })
  },[])


  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.username || 'User'}! 👋
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Ready to dive back into the wave? Ask, answer, and collaborate!
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Your Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-5 rounded-lg shadow-lg text-white flex items-center space-x-4 transition hover:shadow-xl hover:scale-[1.02]">
              <FaStar className="w-8 h-8 text-yellow-300" />
              <PlaceholderIcon className="w-8 h-8 bg-white bg-opacity-30" />
            <div>
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Reputation</p>
              <p className="text-2xl font-bold">{user?.reputation}</p>
            </div>
          </div>
           
           <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow flex items-center space-x-4 transition hover:shadow-xl hover:scale-[1.02]">
             <FaQuestionCircle className="w-8 h-8 text-blue-500" />
             <PlaceholderIcon className="w-8 h-8" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions Asked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.questionsAskedCount}</p>
            </div>
          </div>
           
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow flex items-center space-x-4 transition hover:shadow-xl hover:scale-[1.02]">
              <FaPencilAlt className="w-8 h-8 text-green-500" />
              <PlaceholderIcon className="w-8 h-8" />
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Answers Given</p>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.answerGivenCount}</p>
             </div>
           </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
              <div>
                 <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h3>
                 {/* Replace with actual activity feed items */}
                 <div className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    Activity Feed Coming Soon...
                 </div>
              </div>
               <div>
                 <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">My Content</h3>
                 {/* Replace with tabs or links to user's questions/answers */}
                 <div className="text-center text-gray-500 dark:text-gray-400 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                    Links to My Questions/Answers Coming Soon...
                 </div>
              </div>
          </div>

          
          <div className="space-y-6">
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h3>
                  <div className="space-y-3">
                      <Link to="/ask" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                        <PlusIcon /> Ask Question
                      </Link>

                      <Link to="/rooms" className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                         <CodeIcon /> Create/Join Room
                      </Link>
                  </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Top Contributors</h3>
                  <ul className="space-y-4">
                      {leaderboard.map((contributor, index) => (
                         <li key={contributor._id} className="flex items-center justify-between space-x-3">
                            <div className="flex items-center space-x-3">
                               <span className="font-semibold text-gray-500 dark:text-gray-400 w-5 text-center">{index + 1}</span>
                               <UserAvatar src={contributor.avatar} alt={contributor.username} />
                               <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{contributor.username}</span>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                              {index === 0 && <CrownIcon />} {/* Crown for #1 */}
                              <span className="ml-1">{contributor.reputation}</span>
                            </div>
                         </li>
                      ))}
                  </ul>
                  {/* Optional: Link to full leaderboard page */}
                  <div className="mt-4 text-center">
                      <Link to="/leaderboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                          View Full Leaderboard →
                      </Link>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}

export default Dashboard;