import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import authRoutes from './routes/auth.js';
import trainingRoutes from './routes/trainings.js';
import eventRoutes from './routes/events.js';
import contactRoutes from './routes/contact.js';
import aboutRoutes from './routes/about.js';
import trainersRoutes from './routes/trainers.js';
import { auth } from './middleware/auth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize database
const file = join(__dirname, 'db.json');
const adapter = new FileSync(file);
const db = lowdb(adapter);

// Set defaults
db.defaults({ users: [], trainings: [], events: [], contacts: [], about: {}, trainers: [] }).write();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/trainers', trainersRoutes);

// Database is already initialized with defaults

// Protected routes
app.use('/api/admin/trainings', auth, trainingRoutes);
app.use('/api/admin/events', auth, eventRoutes);
app.use('/api/admin/contact', auth, contactRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 