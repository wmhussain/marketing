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

// Get all trainings
router.get('/', (req, res) => {
  try {
    const trainings = db.get('trainings').value() || [];
    res.json(trainings);
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ message: 'Error fetching trainings' });
  }
});

// Create a new training
router.post('/', (req, res) => {
  try {
    const { title, description, duration, level, prerequisites, objectives, curriculum, price, trainer, imageUrl } = req.body;

    const newTraining = {
      id: uuidv4(),
      title,
      description,
      duration,
      level,
      prerequisites,
      objectives,
      curriculum,
      price,
      trainer,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    db.get('trainings')
      .push(newTraining)
      .write();

    res.status(201).json(newTraining);
  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Error creating training' });
  }
});

// Update a training
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, level, prerequisites, objectives, curriculum, price, trainer, imageUrl } = req.body;

    const exists = db.get('trainings')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Training not found' });
    }

    const updatedTraining = {
      id,
      title,
      description,
      duration,
      level,
      prerequisites,
      objectives,
      curriculum,
      price,
      trainer,
      imageUrl,
      updatedAt: new Date().toISOString()
    };

    db.get('trainings')
      .find({ id })
      .assign(updatedTraining)
      .write();

    res.json(updatedTraining);
  } catch (error) {
    console.error('Error updating training:', error);
    res.status(500).json({ message: 'Error updating training' });
  }
});

// Delete a training
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const exists = db.get('trainings')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Training not found' });
    }

    db.get('trainings')
      .remove({ id })
      .write();

    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error('Error deleting training:', error);
    res.status(500).json({ message: 'Error deleting training' });
  }
});

export default router;
