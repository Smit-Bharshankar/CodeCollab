import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// app.use is used for middleware or configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // !origin allows requests from non-browser clients (like Postman)
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies to be sent/received
  })
);

app.use(express.json({ limit: '16kb' })); // for accepting json data
app.use(express.urlencoded({ extended: true, limit: '16kb' })); // for accepting encoded data from url
app.use(express.static('public')); // for storing assests in public
app.use(cookieParser()); // for reading and writing cookies in user's browser

// Routes Import
import codeRoutes from './routes/code.route.js';

app.use('/api/code', codeRoutes);

export { app, allowedOrigins };
