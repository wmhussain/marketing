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

// Get all contact messages
router.get('/', (req, res) => {
  try {
    const contacts = db.get('contacts').value() || [];
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Create a new contact message
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = {
      id: uuidv4(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    db.get('contacts')
      .push(newContact)
      .write();

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Error creating contact' });
  }
});

// Delete a contact message
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const exists = db.get('contacts')
      .find({ id })
      .value();

    if (!exists) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    db.get('contacts')
      .remove({ id })
      .write();

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact' });
  }
});

export default router;
