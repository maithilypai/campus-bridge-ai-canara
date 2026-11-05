import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to current working directory

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';

// Initialize Express application
const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed by Access-Control-Allow-Origin'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable JSON and URL-encoded request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
connectDB();

// ── API Routes ────────────────────────────────────────────────────────────
// Authentication (register, login, me)
app.use('/api/auth', authRoutes);

// Academic Resources (Autonomous curriculum, notes, question papers, manuals)
app.use('/api/resources', resourceRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'CAMPUS BRIDGE AI',
    subtitle: 'AI-Powered Academic & Skill Development Platform',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Health Check Endpoint (GET /api/health)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Campus Bridge AI Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route '${req.originalUrl}' not found on this server.`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Server Error]\x1b[0m', err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`\x1b[35m[CAMPUS BRIDGE AI - BACKEND]\x1b[0m Server active on port \x1b[36m${PORT}\x1b[0m`);
  console.log(`\x1b[32m[Health Check]\x1b[0m http://localhost:${PORT}/api/health`);
  console.log(`\x1b[34m[Environment]\x1b[0m  ${process.env.NODE_ENV || 'development'}`);
  console.log(`======================================================\n`);
});

export default app;
