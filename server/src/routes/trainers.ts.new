import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Initialize database
const file = join(__dirname, '../db.json');
const adapter = new FileSync(file);
const db = lowdb(adapter);

// Get all trainers
router.get('/', (req, res) => {
  try {
    const trainers = db.get('trainers').value() || [];
    res.json(trainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Error fetching trainers' });
  }
});

// Create a new trainer
router.post('/', (req, res) => {
  try {
    const { name, specialization, experience, education, certifications, achievements, profileImage } = req.body;

    const newTrainer = {
      id: uuidv4(),
      name,
      specialization,
      experience,
      education,
      certifications,
      achievements,
      profileImage,
      createdAt: new Date().toISOString()
    };

    db.get('trainers')
      .push(newTrainer)
      .write();

    res.status(201).json(newTrainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: 'Error creating trainer' });
  }
});

// Update a trainer
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, experience, education, certifications, achievements, profileImage } = req.body;

    const updatedTrainer = {
      id,
      name,
      specialization,
      experience,
      education,
      certifications,
      achievements,
      profileImage,
      updatedAt: new Date().toISOString()
    };

    const exists = db.get('trainers')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    db.get('trainers')
      .find({ id })
      .assign(updatedTrainer)
      .write();

    res.json(updatedTrainer);
  } catch (error) {
    console.error('Error updating trainer:', error);
    res.status(500).json({ message: 'Error updating trainer' });
  }
});

// Delete a trainer
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const exists = db.get('trainers')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    db.get('trainers')
      .remove({ id })
      .write();

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Error deleting trainer' });
  }
});

export default router;
