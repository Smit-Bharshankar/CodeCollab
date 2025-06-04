import React, { useEffect, useState } from 'react';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { socket } from '../utility/socket'; // Assuming this correctly imports your socket.io-client instance
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Room = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [code, setCode] = useState('// Write your code here' + '\n'.repeat(9));
  // This state will now hold the array of user objects received from the server
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [messages, setMessages] = useState([]); // New state to store chat messages

  const { roomId } = useParams();
  const location = useLocation();
  // Ensure userName is retrieved from location.state, defaulting to 'Guest'
  const userName = location.state?.userName || 'Guest';

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Emit 'join' event to the server with a callback for error handling
    socket.emit('join', { roomId, userName }, (error) => {
      if (error) {
        // Display an alert if there's an error from the server (e.g., username taken)
        alert(error);
        navigate('/'); // Navigate back to home on error
      } else {
        // Optional: Confirmation that join was successful
        console.log(`Successfully joined room: ${roomId} as ${userName}`);
      }
    });

    // 2. Listen for 'roomData' event from the server
    // This event will provide the complete and updated list of users in the room
    socket.on('roomData', ({ room, users }) => {
      console.log('Received roomData:', { room, users });
      setUsersInRoom(users); // Update the state with the new list of users
    });

    // 3. Listen for 'message' event from the server (for admin messages like user joined/left)
    socket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Add new message to state
    });

    // 4. Listen for code changes from others
    socket.on('code-change', (val) => {
      setCode(val);
    });

    // Cleanup function when component unmounts
    return () => {
      // Remove all specific event listeners to prevent memory leaks
      socket.off('code-change');
      socket.off('roomData');
      socket.off('message');
      // Emit 'leave-room' when component unmounts (e.g., user navigates away)
      // The server will handle removing the user from its records and broadcasting.
      socket.emit('leave-room');
    };
  }, [roomId, userName, navigate]); // Dependencies: roomId, userName, and navigate to prevent stale closures

  // Handler for changes in the CodeMirror editor
  const handleChange = (val) => {
    setCode(val);
    // Emit code changes to the server to be broadcast to others in the room
    socket.emit('code-change', { roomId, code: val });
  };

  // Handler for the Leave Room button
  const handleLeaveRoom = () => {
    // Emit 'leave-room' event to the server.
    // The server will use socket.id to identify and remove the user.
    socket.emit('leave-room');
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="flex flex-row h-screen bg-gray-700">
      {' '}
      {/* Use h-screen for full height */}
      {/* Code Editor Section */}
      <div className={`flex-grow h-full ${toggleSidebar ? 'w-[85%]' : 'w-full'}`}>
        <CodeMirror
          value={code}
          height="100%" // Make CodeMirror take full height of its container
          theme={oneDark}
          extensions={[javascript()]}
          onChange={handleChange}
          autoFocus={true}
        />
      </div>
      {/* Sidebar Section */}
      {toggleSidebar && (
        <div className="w-[15%] bg-gray-800 text-white p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Room ID: {roomId}</h2>
            <h3 className="text-lg font-semibold mb-2">Joined Users:</h3>
            <ul className="list-disc list-inside mb-4">
              {/* Render the list of users received from the server */}
              {usersInRoom.map((user) => (
                <li key={user.id}>
                  {user.name} {user.id === socket.id && '(You)'}
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-2">Messages:</h3>
            <div className="flex-grow overflow-y-auto border border-gray-600 p-2 rounded max-h-56">
              {' '}
              {/* Added max-h and overflow */}
              {messages.map((msg, index) => (
                <p key={index} className="text-sm">
                  <strong className={msg.user === 'admin' ? 'text-yellow-400' : 'text-blue-300'}>
                    {msg.user}:
                  </strong>{' '}
                  {msg.text}
                </p>
              ))}
            </div>
          </div>

          {/* Leave Room Button */}
          <div className="mt-4">
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
              onClick={handleLeaveRoom}
            >
              Leave Room
            </button>
          </div>
        </div>
      )}
      {/* Sidebar Toggle Button */}
      <button
        className={`absolute ${toggleSidebar ? `top-4 right-[14%] mr-2 ` : ` top-4 right-4`} p-2 bg-gray-700 text-white rounded-full shadow-lg z-10`}
        onClick={() => setToggleSidebar(!toggleSidebar)}
      >
        {toggleSidebar ? <GoSidebarCollapse size={18} /> : <GoSidebarExpand size={18} />}
      </button>
    </div>
  );
};

export default Room;
