// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import { app, allowedOrigins } from './app.js';
import connectMongo from './db/connectMongo.js';

// Socket.IO specific imports
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: './.env' });

const port = process.env.PORT;

// Create the HTTP server using your Express app
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
// Use the same allowedOrigins for Socket.IO CORS as for Express CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the allowedOrigins from app.js
    methods: ['GET', 'POST'], // Specify allowed methods if needed
    credentials: true, // Allow cookies/credentials for Socket.IO if needed
  },
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Event to join a specific room
  socket.on('join', ({ roomId, userName }) => {
    socket.join(roomId);
    socket.username = userName || 'Unknown User'; // Save username on socket
    socket.roomId = roomId;
    console.log(`Socket ${socket.id}  ${userName} joined room: ${roomId}`);
    // Optionally, emit to the room that a new user has joined
    socket.to(roomId).emit('user-joined', userName);
  });

  // Event for code changes within a room
  socket.on('code-change', ({ roomId, code }) => {
    // console.log(`Code change in room ${roomId} by ${socket.id}: ${code.substring(0, 50)}...`);
    // Emit the code change to all sockets in the room EXCEPT the sender
    socket.to(roomId).emit('code-change', code);
  });

  socket.on('leave-room', ({ roomId, userName }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', userName);
    console.log(`User Left: ${socket.id} ${userName} `);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id} ${socket.userName} `);
    // You might want to remove the user from any rooms they were in,
    // or notify other users in those rooms.
  });
});

// Connect to MongoDB and then start the server
connectMongo()
  .then(() => {
    // Listen on the HTTP server (which includes Socket.IO)
    server.listen(port || 4040, () => {
      console.log(`✅ Server is running at the port ${port || 4040}`);
      console.log(`Socket.IO server is also running on port ${port || 4040}`);
    });
  })
  .catch((e) => {
    console.log('❌ Mongodb connection failed :', e);
  });

// This Express route will still work as 'app' is handled by 'server'
app.get('/', (req, res) => res.send(' ✅API Running...'));
