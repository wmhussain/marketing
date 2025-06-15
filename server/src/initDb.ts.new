import lowdb from 'lowdb';
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
  level: string;
  prerequisites: string[];
  objectives: string[];
  curriculum: string[];
  price: number;
  imageUrl: string;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  imageUrl: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface About {
  title: string;
  description: string;
  vision: string;
  mission: string;
}

interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  education: string[];
  certifications: string[];
  achievements: string[];
  profileImage: string;
  createdAt: string;
}

interface DB {
  users: User[];
  trainings: Training[];
  events: Event[];
  contacts: Contact[];
  about: About;
  trainers: Trainer[];
}

const file = join(__dirname, 'db.json');
const adapter = new FileSync<DB>(file);
const db = lowdb(adapter);

// Set defaults
db.defaults({
  users: [{
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  }],
  trainings: [],
  events: [],
  contacts: [],
  about: {
    title: 'Welcome to CV Training Center',
    description: 'Your premier destination for professional development',
    vision: 'To be the leading training center in professional development',
    mission: 'To provide high-quality training and development opportunities'
  },
  trainers: []
}).write();

console.log('Database initialized successfully!');
