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

// Get all events
router.get('/', (req, res) => {
  try {
    const events = db.get('events').value();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event
router.get('/:id', (req, res) => {
  try {
    const event = db.get('events').find({ id: req.params.id }).value();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', (req, res) => {
  try {
    const newEvent = {
      id: Date.now().toString(),
      ...req.body
    };
    db.get('events').push(newEvent).write();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', (req, res) => {
  try {
    const event = db.get('events').find({ id: req.params.id }).value();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const updatedEvent = { ...event, ...req.body };
    db.get('events')
      .find({ id: req.params.id })
      .assign(updatedEvent)
      .write();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', (req, res) => {
  try {
    const event = db.get('events').find({ id: req.params.id }).value();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    db.get('events').remove({ id: req.params.id }).write();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 