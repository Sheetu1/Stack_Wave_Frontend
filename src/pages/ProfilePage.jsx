// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns'; // Need formatDistanceToNow for 'Member for'
import { BASE_URL } from '../utils/constants';

// --- Icons & Components ---
const EditProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const UserAvatar = ({ src, alt, size = "w-24 h-24" }) => <img className={`rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-700 ${size}`} src={src} alt={alt} />; // Added border
const ReputationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-yellow-500"><path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.463 3.38.82 4.646 4.28 2.147 2.451 4.305c.216.38.74.38.956 0l2.451-4.305 4.28-2.147.82-4.646-3.463-3.38-4.753-.39-1.83-4.401zM10 14.118a4.118 4.118 0 100-8.236 4.118 4.118 0 000 8.236z" clipRule="evenodd" /></svg>; // Example Star/Rep Icon
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>;

function ProfilePage() {
    const { userId: profileUserId } = useParams();
    const navigate = useNavigate();
    const { user: loggedInUser, token } = useSelector(state => state.user);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = loggedInUser?._id === profileUserId;

    // ... (useEffect for fetching data - same as before) ...
     useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true); setError(null);
            try {
                const response = await axios.get(`${BASE_URL}/api/users/${profileUserId}`,{
                    headers: {Authorization: `bearer ${token}`}
                });
                if (response.data && response.data.user) { setProfileData(response.data.user); }
                else { throw new Error("User data not found in response."); }
            } catch (err) { /* ... handle fetch error ... */ }
            finally { setLoading(false); }
        };
        fetchUserProfile();
    }, [ profileUserId, loggedInUser?._id ]);


    // --- Render Logic ---
    if (loading) return <div className="p-6 text-center">Loading profile...</div>;
    if (error) return <div className="p-6 text-center text-red-500 ...">Error: {error}</div>;
    if (!profileData) return <div className="p-6 text-center">User profile not found.</div>;

    // Destructure profile data for easier use
    const { name, username, avatar, reputation, createdAt, bio, /* badges (if you have them) */ } = profileData;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative">
                 {isOwnProfile && (
                     <Link to={`/profile/${profileUserId}/edit`} className="absolute top-4 right-4 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                         <EditProfileIcon /> Edit Profile
                     </Link>
                 )}

                 
                 <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-5">
                    <div className="relative flex-shrink-0 mb-4 sm:mb-0 -mt-12 sm:-mt-16">
                        <UserAvatar
                            src={avatar || `https://ui-avatars.com/api/?name=${name || username || '?'}&size=96&background=random`}
                            alt={name || username}
                            size="w-24 h-24 sm:w-28 sm:h-28"
                        />
                        
                    </div>
                    
                    <div className="text-center sm:text-left flex-grow">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate" title={name || username}>
                            {name || username || 'Unnamed User'}
                        </h1>

                        {/* Stats Row */}
                        <div className="mt-2 flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                             <div className="flex items-center" title={`${reputation || 0} reputation points`}>
                                 <ReputationIcon />
                                 <span className="font-medium">{reputation || 0}</span>
                                 <span className="ml-1">Reputation</span>
                             </div>
                             {/* Joined Date */}
                             <div className="flex items-center" title={`Joined on ${createdAt ? format(new Date(createdAt), 'PPP') : 'N/A'}`}>
                                 <CalendarIcon />
                                 <span>
                                     Member for {createdAt ? formatDistanceToNow(new Date(createdAt)) : '...'}
                                 </span>
                             </div>
                        </div>
                         {/* Placeholder for Badges */}
                         <div className="mt-3 h-6"> Badges placeholder </div>
                    </div>
                 </div>
            </div>
            {/* --- End Profile Header Section --- */}

            {/* --- Bio Section (Placeholder) --- */}
             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                 <h2 className="text-lg font-semibold mb-2">About</h2>
                 {bio ? (
                     <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{bio}</p>
                 ) : (
                     <p className="text-gray-500 dark:text-gray-400 italic">
                         {isOwnProfile ? "You haven't added a bio yet. Click 'Edit Profile' to add one!" : "This user hasn't added a bio yet."}
                     </p>
                 )}
             </div>

            {/* --- Tabs & Activity Area (Placeholder) --- */}
             <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                 TABS (Questions/Answers) & CONTENT AREA - Coming Later!
             </div>

        </div>
    );
}

export default ProfilePage;