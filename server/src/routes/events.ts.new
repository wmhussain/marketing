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

// Get all events
router.get('/', (req, res) => {
  try {
    const events = db.get('events').value() || [];
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Create a new event
router.post('/', (req, res) => {
  try {
    const { title, description, date, time, location, type, imageUrl } = req.body;

    const newEvent = {
      id: uuidv4(),
      title,
      description,
      date,
      time,
      location,
      type,
      imageUrl,
      createdAt: new Date().toISOString()
    };

    db.get('events')
      .push(newEvent)
      .write();

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Update an event
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, type, imageUrl } = req.body;

    const exists = db.get('events')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = {
      id,
      title,
      description,
      date,
      time,
      location,
      type,
      imageUrl,
      updatedAt: new Date().toISOString()
    };

    db.get('events')
      .find({ id })
      .assign(updatedEvent)
      .write();

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete an event
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const exists = db.get('events')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    db.get('events')
      .remove({ id })
      .write();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

export default router;
