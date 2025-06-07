import { useEffect, useState } from 'react';
import axios from 'axios';
import CodeMirror, { oneDark } from '@uiw/react-codemirror';
import CodeTerminal from '../Components/CodeTerminal';
import { javascript } from '@codemirror/lang-javascript';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { socket } from '../utility/socket';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Room = () => {
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const [code, setCode] = useState('// Write your code here\n\n\n\n\n\n\n\n\n\n');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [messages, setMessages] = useState([]);

  const { roomId } = useParams();
  const location = useLocation();
  const userName = location.state?.userName || 'Guest';
  const navigate = useNavigate();

  const handleRunCode = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/code/run`, {
        language,
        code,
      });
      console.log(response.data.data.output);
      setOutput(response.data.data.output);
    } catch (error) {
      setOutput(error?.response?.data?.error || 'Execution failed. See server logs.');
    }
  };

  useEffect(() => {
    socket.emit('join', { roomId, userName }, (error) => {
      if (error) {
        alert(error);
        navigate('/');
      }
    });

    socket.on('roomData', ({ users }) => {
      setUsersInRoom(users);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('code-change', (val) => {
      setCode(val);
    });

    return () => {
      socket.emit('leave-room');
      socket.off('code-change');
      socket.off('roomData');
      socket.off('message');
    };
  }, [roomId, userName]);

  const handleChange = (val) => {
    setCode(val);
    socket.emit('code-change', { roomId, code: val });
  };

  const handleLeaveRoom = () => {
    socket.emit('leave-room');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main Editor + Sidebar */}
      <div className="flex flex-grow relative">
        <div className={`transition-all duration-300 ${toggleSidebar ? 'w-4/5' : 'w-full'}`}>
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            extensions={[javascript()]}
            onChange={handleChange}
            autoFocus
          />
        </div>

        {toggleSidebar && (
          <aside className="w-1/5 border-l border-gray-800 bg-gray-800 flex flex-col justify-between p-4">
            <div className="overflow-y-auto">
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-1">Room ID</h2>
                <p className="text-sm text-gray-400 break-all">{roomId}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-md mb-1">Users</h3>
                <ul className="space-y-1 text-sm">
                  {usersInRoom.map((user) => (
                    <li key={user.id} className="text-gray-300">
                      • {user.name}{' '}
                      {user.id === socket.id && <span className="text-green-400">(You)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-md mb-1">Messages</h3>
                <div className="bg-gray-900 border border-gray-700 p-2 rounded max-h-40 overflow-y-auto text-sm">
                  {messages.map((msg, idx) => (
                    <p key={idx}>
                      <strong
                        className={msg.user === 'admin' ? 'text-yellow-400' : 'text-blue-400'}
                      >
                        {msg.user}:
                      </strong>{' '}
                      {msg.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  className="bg-gray-700 text-white px-2 py-1 rounded"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
                <button
                  onClick={handleRunCode}
                  className="bg-purple-700 px-3 py-1 rounded hover:bg-purple-800"
                >
                  Run
                </button>
              </div>

              <button
                onClick={handleLeaveRoom}
                className="w-full bg-red-600 py-2 rounded hover:bg-red-700 text-white"
              >
                Leave Room
              </button>
            </div>
          </aside>
        )}

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setToggleSidebar(!toggleSidebar)}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          {toggleSidebar ? <GoSidebarCollapse /> : <GoSidebarExpand />}
        </button>
      </div>

      {/* Terminal Section */}
      <div className="h-60 border-t border-gray-800 overflow-auto">
        <CodeTerminal output={output} />
      </div>
    </div>
  );
};

export default Room;
