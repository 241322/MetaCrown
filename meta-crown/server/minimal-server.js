import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client')));

// API test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple cards API (without database)
app.get('/api/cr/cards', (req, res) => {
  res.json({ 
    message: 'Cards API placeholder', 
    items: [
      { name: 'Knight', id: 1 },
      { name: 'Wizard', id: 2 }
    ]
  });
});

// Catch-all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Enhanced server running on ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'client')}`);
});