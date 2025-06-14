import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
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
app.use(cors());
app.use(express.json());

// Initialize database
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/trainers', trainersRoutes);

// Initialize database with default values
db.defaults({ users: [], trainings: [], events: [], contacts: [], about: {}, trainers: [] }).write();

// Protected routes
app.use('/api/admin/trainings', auth, trainingRoutes);
app.use('/api/admin/events', auth, eventRoutes);
app.use('/api/admin/contact', auth, contactRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 