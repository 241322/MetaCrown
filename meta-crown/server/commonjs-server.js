const express = require('express');

const app = express();

// Only basic routes - CommonJS syntax
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working with CommonJS!', 
    timestamp: new Date()
  });
});

app.get('/test', (req, res) => {
  res.send('CommonJS test route working!');
});

app.get('/', (req, res) => {
  res.send('Hello from MetaCrown CommonJS server!');
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`CommonJS server running on ${PORT}`);
});