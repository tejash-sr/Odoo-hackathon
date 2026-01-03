import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import tripRoutes from './routes/trips.js';
import destinationRoutes from './routes/destinations';
import expenseRoutes from './routes/expenses';
import aiRoutes from './routes/ai';

// Load environment variables
dotenv.config();

const app: express.Application = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'http://localhost:8081', // Expo
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join trip room for real-time updates
  socket.on('join-trip', (tripId: string) => {
    socket.join(`trip:${tripId}`);
    console.log(`User ${socket.id} joined trip: ${tripId}`);
  });

  // Leave trip room
  socket.on('leave-trip', (tripId: string) => {
    socket.leave(`trip:${tripId}`);
    console.log(`User ${socket.id} left trip: ${tripId}`);
  });

  // Real-time expense update
  socket.on('expense-added', (data) => {
    socket.to(`trip:${data.tripId}`).emit('expense-update', data);
  });

  // Real-time itinerary update
  socket.on('itinerary-update', (data) => {
    socket.to(`trip:${data.tripId}`).emit('itinerary-changed', data);
  });

  // Chat messages
  socket.on('chat-message', (data) => {
    socket.to(`trip:${data.tripId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.io ready for connections`);
});

export { io };
export default app;
