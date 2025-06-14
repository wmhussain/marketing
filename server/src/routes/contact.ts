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

// Submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    db.get('contacts').push(contact).write();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting message' });
  }
});

// Get all contact submissions (admin only)
router.get('/', (req, res) => {
  try {
    res.json(db.get('contacts').value() || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status (admin only)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const contacts = db.get('contacts').value();
    const index = contacts.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    const updatedContacts = [
      ...contacts.slice(0, index),
      { ...contacts[index], status },
      ...contacts.slice(index + 1)
    ];
    db.set('contacts', updatedContacts).write();
    res.json(contacts[index]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 