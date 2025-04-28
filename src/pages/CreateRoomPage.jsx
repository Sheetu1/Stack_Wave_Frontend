
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import CreateRoomModal from '../components/rooms/CreateRoomModal';
import RoomCard from '../components/rooms/RoomCard';


// Placeholder Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
const LoginIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;


function CreateRoomsPage() {
  const navigate = useNavigate();
  const { token } = useSelector(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myRooms, setMyRooms] = useState([]);

  // --- TODO: Fetch user's rooms later ---
  useEffect(() => {
    const fetchMyRooms = () => { 
      axios.get(BASE_URL + "/api/room/find",{
        headers: {Authorization: `bearer ${token}`}
      })
      .then((res) => {
        console.log(res);
        setMyRooms(res.data.rooms);
      })
      .catch((err) => {
        setError(err.response.data.message)
      })
    };
    if (token) fetchMyRooms();
  }, [token]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);


  const handleJoinRoom = (e) => {
    e.preventDefault();
    setError(null);
    const roomIdToJoin = joinRoomId.trim();
    if (roomIdToJoin) {
        const parts = roomIdToJoin.split('/');
        const potentialId = parts[parts.length - 1];

        if (potentialId) {
             console.log(`Attempting to join room: ${potentialId}`);
             navigate(`/room/${potentialId}`);
        } else {
             setError("Invalid Room Code or Link provided.");
        }
    } else {
      setError("Please enter a Room Code or Link.");
    }
  };

  const createRoomApiCall = async ({ roomName, language }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/api/room/create`,
        { name: roomName, language },
        { headers: { Authorization: `bearer ${token}` } }
      );
      const newRoomId = response.data?.room?.roomId || response.data?.roomId;
      if (newRoomId) {
        handleCloseModal();
        navigate(`/room/${newRoomId}`);
      } else {
        console.error("Room ID not found:", response.data);
        throw new Error("Could not create room. Missing room ID.");
      }
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.message || err.message || "Failed to create room.");
      setIsLoading(false);
    } finally {
       setIsLoading(false);
    }
  };

  const handleDeleteRooms = (roomId) => {
    axios.delete(BASE_URL + `/api/room/delete/${roomId}`, {
      headers: { Authorization: `bearer ${token}`}
    })
    .then((res) => {
      const deletedRoom = res.data.room;
      setMyRooms(prev => prev.filter((item) => item._id !== deletedRoom._id))
    })
    .catch((err) => {
      setError(err.data.response.message);
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
             <CodeIcon/> Collaboration Rooms
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create or join rooms to code live with others.</p>
        </div>
        <button onClick={handleOpenModal} className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
          <PlusIcon /> Create New Room
        </button>
      </div>


       {error && !isModalOpen && (
         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
           <p>{error}</p>
         </div>
       )}


      {/* Join Room Section */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Join a Room</h2>
          <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-3">
             <label htmlFor="roomIdInput" className="sr-only">Room Code or Link</label>
             <input
                type="text"
                id="roomIdInput"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter Room Code or Link..."
                className="flex-grow block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
             />
             <button
                type="submit"
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap"
             >
                <LoginIcon /> Join Room
             </button>
          </form>
       </div>


      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Rooms</h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 border-gray-300 dark:border-gray-600 rounded-md">
          {myRooms.length <= 0 && <p>No rooms found yet ...</p> }
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {myRooms.map(room => <RoomCard key={room._id} room={room} onDelete={(roomId) => handleDeleteRooms(roomId)} />)}
             </div>
        </div>
      </div>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={createRoomApiCall}
        isLoading={isLoading}
        error={error}
        clearError={() => setError(null)}
      />
    </div>
  );
}

export default CreateRoomsPage;