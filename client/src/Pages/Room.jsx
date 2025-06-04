import React, { useEffect, useState } from 'react';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { socket } from '../utility/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Room = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [code, setCode] = useState('// Write your code here');

  const { roomId } = useParams();
  const location = useLocation();
  const userName = location.state?.userName || 'Unknown User';

  const navigate = useNavigate();

  useEffect(() => {
    // Join room with username
    socket.emit('join', { roomId, userName });

    // Listen for code changes from others
    socket.on('code-change', (val) => {
      setCode(val);
    });

    // Listen for new user join
    socket.on('user-joined', (joinedUser) => {
      alert(`${joinedUser} joined the room!`);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('code-change');
      socket.off('user-joined');
    };
  }, [roomId, userName]);

  const handleChange = (val) => {
    setCode(val);
    socket.emit('code-change', { roomId, code: val });
  };

  return (
    <div className="flex flex-row items-center ">
      <div className="w-[85%]">
        <CodeMirror
          value={code}
          minHeight="600px"
          theme={oneDark}
          extensions={[javascript()]}
          onChange={handleChange}
        />
      </div>

      {/* Sidebar  */}
      <div>
        {toggleSidebar == true ? (
          <div className="w-[15%]">
            <div>
              <h2 className="text-xl font-bold mb-4">Room ID: {roomId}</h2>
              <span>Joined Users</span>
            </div>

            {/* for leave button  */}
            <div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => {
                  socket.emit('leave-room', { roomId, userName });
                  navigate('/');
                }}
              >
                Leave Room
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Room;
