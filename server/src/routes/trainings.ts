import express from 'express';
import Low from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Database setup
const adapter = new JSONFile(join(__dirname, '../db.json'));
const db = new (Low as any)(adapter) as any;

// Get all trainings
router.get('/', (req, res) => {
  try {
    const trainings = db.get('trainings').value();
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single training
router.get('/:id', (req, res) => {
  try {
    const training = db.get('trainings').find({ id: req.params.id }).value();
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    res.json(training);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create training
router.post('/', (req, res) => {
  try {
    const newTraining = {
      id: Date.now().toString(),
      ...req.body
    };
    db.get('trainings').push(newTraining).write();
    res.status(201).json(newTraining);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update training
router.put('/:id', (req, res) => {
  try {
    const training = db.get('trainings').find({ id: req.params.id }).value();
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    const updatedTraining = { ...training, ...req.body };
    db.get('trainings')
      .find({ id: req.params.id })
      .assign(updatedTraining)
      .write();
    res.json(updatedTraining);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete training
router.delete('/:id', (req, res) => {
  try {
    const training = db.get('trainings').find({ id: req.params.id }).value();
    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }
    db.get('trainings').remove({ id: req.params.id }).write();
    res.json({ message: 'Training deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 