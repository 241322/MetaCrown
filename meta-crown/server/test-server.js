import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client')));

// API test route (without database)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch-all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Test server running on ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});