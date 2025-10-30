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
    timestamp: new Date()
  });
});

// Keep the test route for debugging
app.get('/test', (req, res) => {
  res.send('Simple test route working!');
});

// Catch-all handler: send back React's index.html file for any route not handled above
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`MetaCrown server running on ${PORT}`);
  console.log(`Serving React app from: ${path.join(__dirname, 'client')}`);
});