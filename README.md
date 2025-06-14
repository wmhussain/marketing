# Mazhar Hussain Warsi - Professional Website

A professional website for Mazhar Hussain Warsi, showcasing his expertise as a Solution Architect and Technology Trainer specializing in VMware, Microsoft, and Linux technologies.

## Features

- Modern, responsive design
- Training catalog with online and onsite options
- Event calendar
- Contact form
- Admin dashboard for managing content
- Secure authentication system

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Hook Form for form handling
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- LowDB for local file-based database
- JWT for authentication

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd mazhar-warsi-website
```

2. Install dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```
PORT=5000
JWT_SECRET=your-secret-key
```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm run dev
```

5. Access the website:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Admin Access

Default admin credentials:
- Username: admin
- Password: *********

**Note:** Change these credentials in production.

## Project Structure

```
mazhar-warsi-website/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── App.tsx       # Main application component
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 
