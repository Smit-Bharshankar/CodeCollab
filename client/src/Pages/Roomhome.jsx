import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Roomhome = () => {
  const navigate = useNavigate();

  const [joinRoomIdInput, setJoinRoomIdInput] = useState('');
  const [createRoomIdInput, setCreateRoomIdInput] = useState('');
  const [userName, setUserName] = useState('');

  const handleCreateRoom = () => {
    // Generate a brand new UUID when the 'Create Room' button is clicked
    // const newRoomId = uuidv4();
    if (createRoomIdInput.trim() && userName.trim()) {
      navigate(`/room/${createRoomIdInput.trim()}`, { state: { userName } });
    } else {
      alert('Please enter a Room ID and UserName to create');
    }
  };

  const handleJoinRoom = () => {
    if (joinRoomIdInput.trim()) {
      navigate(`/room/${joinRoomIdInput.trim()}`);
    } else {
      alert('Please enter a Room ID to join');
    }
  };

  // Handler for changes in the 'Join Room' input field
  // 'event' is explicitly passed as a parameter here, resolving the warning.
  const handleCreateInputChange = (event) => {
    setCreateRoomIdInput(event.target.value);
  };

  const handleJoinInputChange = (event) => {
    setJoinRoomIdInput(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-center font-mono text-4xl font-extrabold mb-8 text-green-400">
        Welcome to the CodeCollab
      </h1>

      <div className="flex flex-col items-center justify-center w-full max-w-lg bg-green-900 p-8 rounded-xl shadow-2xl border border-green-700">
        <h2 className="capitalize text-3xl mb-8 font-semibold text-center border-b border-green-700 pb-4 w-full">
          Create a Room or Join an Existing One
        </h2>

        {/* Create Room Section */}
        <div className="mb-10 w-full">
          <h3 className="text-xl mb-4 font-medium text-green-200">Create a New Room</h3>
          <input
            type="text"
            placeholder="Enter Room ID"
            className="bg-green-800 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full mb-4 text-lg"
            value={createRoomIdInput} // Controlled component: value comes from state
            onChange={handleCreateInputChange} // Correct handler: updates state on change
          />
          <input
            type="text"
            placeholder="Enter UserName"
            className="bg-green-800 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full mb-4 text-lg"
            onChange={(e) => setUserName(e.target.value)} // Correct handler: updates state on change
          />
          <button
            onClick={handleCreateRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Create New Room
          </button>
        </div>

        {/* Join Room Section */}
        <div className="w-full">
          <h3 className="text-xl mb-4 font-medium text-green-200">Join an Existing Room</h3>
          <input
            type="text"
            placeholder="Enter Room ID"
            className="bg-green-800 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full mb-4 text-lg"
            value={joinRoomIdInput} // Controlled component: value comes from state
            onChange={handleJoinInputChange} // Correct handler: updates state on change
          />
          <button
            onClick={handleJoinRoom}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 w-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roomhome;
