const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

async function initDb() {
  db.defaults({ users: [], trainings: [], events: [], contacts: [] }).write();

  // Add admin user if not exists
  const adminExists = db.get('users').find({ username: 'admin' }).value();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.get('users').push({
      id: '1',
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }).write();
  }

  // Add sample trainings if not exists
  if (db.get('trainings').value().length === 0) {
    db.get('trainings').push(
      {
        id: '1',
        title: 'VMware vSphere Administration',
        description: 'Comprehensive training on VMware vSphere administration and management.',
        duration: '5 days',
        price: 2500,
        type: 'onsite',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Microsoft Azure Fundamentals',
        description: 'Learn the basics of Microsoft Azure cloud platform and services.',
        duration: '3 days',
        price: 1500,
        type: 'online',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        createdAt: new Date().toISOString()
      }
    ).write();
  }

  // Add sample events if not exists
  if (db.get('events').value().length === 0) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    db.get('events').push(
      {
        id: '1',
        title: 'VMware Workshop',
        description: 'Hands-on workshop for VMware vSphere administration.',
        startDate: nextWeek.toISOString(),
        endDate: new Date(nextWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Virtual',
        type: 'online',
        createdAt: new Date().toISOString()
      }
    ).write();
  }

  console.log('Database initialized successfully');
}

initDb().catch(console.error); 