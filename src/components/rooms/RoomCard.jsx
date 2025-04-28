
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';


const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.326.426C4.604 4.443 4 5.133 4 5.942v.33l-.044.018C2.772 6.734 2 7.818 2 9.168v.903c0 1.211.749 2.24 1.83 2.715l-.03.012v.328c0 .77.54 1.437 1.257 1.612C5.93 15.048 7.4 15.5 9 15.5h.084c1.6 0 3.07-.452 4.209-1.236.18-.124.34-.26.484-.404c.14-.144.264-.3.372-.468l.005-.009v-.133a3.001 3.001 0 00.8-.585c.979-.98 1.5-2.305 1.5-3.714v-.903c0-1.35-.772-2.434-1.87-2.914l-.044-.018v-.33c0-.81-.604-1.499-1.674-1.714A16.12 16.12 0 0014 3.75v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 5.5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5a.75.75 0 01.75-.75zM8.75 8a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75zM11.25 8a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L3.56 9h12.88a.75.75 0 010 1.5H3.56l2.72 2.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L16.44 10.5H3.56a.75.75 0 010-1.5h12.88l-2.72-2.72a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>; // Example Code Icon

function RoomCard({ room, onDelete }) {
  const { user: loggedInUser } = useSelector(state => state.user);
  const isHost = loggedInUser?._id === (room.host?._id || room.host);

  const handleDeleteClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm(`Are you sure you want to delete room "${room.name || room.roomId}"?.`)) {
          if (onDelete) {
              onDelete(room.roomId);
          }
      }
  };


  const displayName = room.name;
  const timeAgo = room.createdAt ? formatDistanceToNow(new Date(room.createdAt), { addSuffix: true }) : 'Unknown time';
  const participantsToShow = room.participants?.slice(0, 4) || [];

  return (
    <div className="relative group bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg border border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 flex flex-col justify-between min-h-[160px]"> 

      {
        isHost && <button onClick={handleDeleteClick} className="absolute top-2 right-2 p-1 rounded-full bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-gray-600 group-hover:opacity-100 transition-opacity duration-150 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500" title="Delete Room">
          <TrashIcon />
        </button>
      }
      

      {/* Card Content */}
      <div>
          <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1 pr-8" title={displayName}>
            {displayName}
          </h4>

          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <CodeIcon />
              <span>{room.language || 'N/A'}</span>
              <span>•</span>
              <span>{timeAgo}</span>
          </div>

           <div className="flex items-center space-x-2 mb-4">
             <div className="flex -space-x-2 overflow-hidden">
                 {participantsToShow.map(p => (
                      <img
                         key={p._id}
                         className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
                         src={p.avatar || `https://ui-avatars.com/api/?name=${p.username || '?'}&size=24&background=random`}
                         alt={p.username}
                         title={p.username}
                      />
                  ))}
             </div>
             {(!room.participants || room.participants.length === 0) && (
                 <span className="text-xs italic text-gray-400 dark:text-gray-500">No participants yet</span>
             )}
           </div>
      </div>

      {/* Join Button */}
      <Link to={`/room/${room.roomId}`} className="block w-full text-center px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-150">
        Join Room
      </Link>
    </div>
  );
}

export default RoomCard;