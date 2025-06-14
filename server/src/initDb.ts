import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  imageUrl: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

interface Database {
  users: User[];
  trainings: Training[];
  events: Event[];
  contacts: any[];
}

const adapter = new FileSync(join(__dirname, 'db.json'));
const db = low(adapter);

async function initDb() {
  try {
    console.log('Starting database initialization...');
    
    // Initialize with empty arrays if they don't exist
    db.defaults({ users: [], trainings: [], events: [], contacts: [] }).write();
    console.log('Database initialized with empty collections');

    // Check if admin user exists
    const adminExists = db.get('users').find({ username: 'admin' }).value();
    console.log('Admin user exists:', !!adminExists);

    if (!adminExists) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      console.log('Password hashed successfully');
      
      db.get('users').push({
        id: '1',
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      }).write();
      console.log('Admin user added to database');
    }

    // Add sample training courses if they don't exist
    if (db.get('trainings').value().length === 0) {
      console.log('Adding sample trainings...');
      db.get('trainings').push(
        {
          id: '1',
          title: 'Basic Training',
          description: 'Introduction to basic concepts',
          duration: '2 hours',
          price: 99,
          imageUrl: 'https://source.unsplash.com/random/800x600/?training'
        },
        {
          id: '2',
          title: 'Advanced Training',
          description: 'Deep dive into advanced topics',
          duration: '4 hours',
          price: 199,
          imageUrl: 'https://source.unsplash.com/random/800x600/?workshop'
        }
      ).write();
      console.log('Sample trainings added');
    }

    // Add sample events if they don't exist
    if (db.get('events').value().length === 0) {
      console.log('Adding sample events...');
      db.get('events').push(
        {
          id: '1',
          title: 'Workshop 1',
          description: 'Hands-on workshop',
          date: '2024-03-01',
          time: '10:00',
          location: 'Main Hall',
          imageUrl: 'https://source.unsplash.com/random/800x600/?workshop'
        },
        {
          id: '2',
          title: 'Workshop 2',
          description: 'Advanced techniques',
          date: '2024-03-15',
          time: '14:00',
          location: 'Conference Room',
          imageUrl: 'https://source.unsplash.com/random/800x600/?conference'
        }
      ).write();
      console.log('Sample events added');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb(); 