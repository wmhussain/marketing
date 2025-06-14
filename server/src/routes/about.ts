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

// Get about content
router.get('/', (req, res) => {
  try {
    const aboutContent = db.get('about').value() || {
      title: '',
      description: '',
      vision: '',
      mission: '',
    };
    res.json(aboutContent);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Error fetching about content' });
  }
});

// Update about content
router.put('/', (req, res) => {
  try {
    const { title, description, vision, mission } = req.body;

    const updatedContent = {
      title,
      description,
      vision,
      mission,
    };

    db.set('about', updatedContent).write();
    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ message: 'Error updating about content' });
  }
});

export default router;
