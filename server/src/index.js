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

// --- Server-side user management (simplified) ---
// This array will store objects representing users currently connected
// Each user object will have: { id: socket.id, name: 'userName', room: 'roomId' }
const users = [];

// Helper function to add a user to the 'users' array
const addUser = ({ id, name, room }) => {
  // Trim whitespace and convert name/room to lowercase for consistent checking
  name = name.trim();
  room = room.trim();

  // Optional: Check if a user with the same name already exists in this room
  // This prevents multiple users with the exact same name in one room.
  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: 'Username is taken in this room.' };
  }

  // Create the new user object and add it to the global 'users' array
  const user = { id, name, room };
  users.push(user);
  return { user }; // Return the created user object
};

// Helper function to remove a user from the 'users' array by their socket ID
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0]; // Remove the user and return the removed user object
  }
};

// Helper function to get a user by their socket ID
const getUser = (id) => users.find((user) => user.id === id);

// Helper function to get all users currently in a specific room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);
// --- End server-side user management ---

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Event handler when a client emits a 'join' event
  socket.on('join', ({ roomId, userName }, callback) => {
    // Attempt to add the user using our helper function
    const { error, user } = addUser({ id: socket.id, name: userName, room: roomId });

    // If there's an error (e.g., username taken), send it back to the client
    if (error) {
      return callback(error); // Use callback to send immediate feedback to the client
    }

    // Join the Socket.IO room (this links the socket to a specific logical room)
    socket.join(user.room);
    // Store user name and room ID directly on the socket object for easy access later
    socket.userName = user.name;
    socket.roomId = user.room;

    console.log(`Socket ${socket.id} ${user.name} joined room: ${user.room}`);

    // Send a welcome message to the user who just joined (only to this specific socket)
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });

    // Broadcast to everyone else in the room (excluding the sender) that a new user has joined
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    // Emit updated room data (including the current list of users) to ALL sockets in that room
    // This ensures everyone gets the latest list of participants.
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room), // Get the latest list of users for this room
    });

    callback(); // Acknowledge successful join to the client
  });

  // Event for code changes within a room
  socket.on('code-change', ({ roomId, code }) => {
    // console.log(`Code change in room ${roomId} by ${socket.id}: ${code.substring(0, 50)}...`);
    // Emit the code change to all sockets in the room EXCEPT the sender
    socket.to(roomId).emit('code-change', code);
  });

  // Event handler when a client explicitly leaves a room
  socket.on('leave-room', () => {
    // Removed {roomId, userName} from event args as we get it from socket properties
    const user = removeUser(socket.id); // Remove the user using their socket ID

    if (user) {
      socket.leave(user.room); // Make the socket leave the Socket.IO room
      // Inform others in the room that a user has left
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });

      // Emit updated room data (users list) to everyone in that room
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      console.log(`User Left: ${socket.id} ${user.name} from room ${user.room}`);
    } else {
      console.log(`Socket ${socket.id} attempted to leave but no user found in records.`);
    }
  });

  // Handle disconnection event (client closes browser, network issues, etc.)
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    const user = removeUser(socket.id); // Remove the user using their socket ID

    if (user) {
      // Inform others in the room that a user has left
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });

      // Emit updated room data (users list) to everyone in that room
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      console.log(`User disconnected: ${user.name} from room ${user.room}`);
    }
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
