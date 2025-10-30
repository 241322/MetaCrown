import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fallback database configuration for production
if (!process.env.DB_USER) {
  console.log('⚠️ Environment variables not loaded, using fallback config');
  process.env.DB_HOST = 'localhost';
  process.env.DB_USER = 'metacrownco_Xander_Admin';
  process.env.DB_PASSWORD = 'Xander@@007@@';
  process.env.DB_NAME = 'metacrownco_meta_crown_db';
}

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database initialization status
let dbInitialized = false;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    console.log('Environment variables loaded:', {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD ? '***PRESENT***' : 'MISSING',
      DB_NAME: process.env.DB_NAME
    });
    console.log('Database config being used:', {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root", 
      password: process.env.DB_PASSWORD ? '***PRESENT***' : 'MISSING',
      database: process.env.DB_NAME || "meta_crown_db"
    });
    
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database tables (creates tables if they don't exist)
    await db.sequelize.sync();
    console.log('✅ Database synchronized');
    
    dbInitialized = true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      errno: error.errno
    });
  }
};

// Initialize database on startup
initializeDatabase();

const app = express();
app.use(express.json());

// Serve static files from React build - this handles most file requests
app.use(express.static(path.join(__dirname, 'client')));

// Middleware to check database initialization for API routes that need DB
const requireDatabase = (req, res, next) => {
  if (!dbInitialized) {
    return res.status(503).json({ 
      error: 'Database not initialized yet',
      message: 'Please try again in a few moments'
    });
  }
  next();
};

// API test route
app.get('/api/test', (req, res) => {
  const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
  
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    hasClashToken: !!process.env.CLASH_API_TOKEN,
    usingFallback: !process.env.CLASH_API_TOKEN,
    tokenSource: process.env.CLASH_API_TOKEN ? 'environment' : 'fallback'
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    
    // Try to get table info
    const tableInfo = await db.sequelize.getQueryInterface().showAllTables();
    
    res.json({
      status: 'connected',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      tables: tableInfo,
      envLoaded: {
        DB_HOST: !!process.env.DB_HOST,
        DB_USER: !!process.env.DB_USER,
        DB_PASSWORD: !!process.env.DB_PASSWORD,
        DB_NAME: !!process.env.DB_NAME
      },
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'disconnected',
      error: error.message,
      database: process.env.DB_NAME || 'NOT SET',
      host: process.env.DB_HOST || 'NOT SET',
      user: process.env.DB_USER || 'NOT SET',
      envLoaded: {
        DB_HOST: !!process.env.DB_HOST,
        DB_USER: !!process.env.DB_USER,
        DB_PASSWORD: !!process.env.DB_PASSWORD,
        DB_NAME: !!process.env.DB_NAME
      }
    });
  }
});

// Clash Royale API routes (with .env support)
app.get('/api/cr/cards', async (req, res) => {
  try {
    // Fallback token if environment variable not set
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch('https://api.clashroyale.com/v1/cards', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Cards API error:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.get('/api/cr/player/:playerTag', async (req, res) => {
  try {
    const { playerTag } = req.params;
    const encodedTag = encodeURIComponent(playerTag);
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch(`https://api.clashroyale.com/v1/players/${encodedTag}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Player API error:', error);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

// Add leaderboards endpoint
app.get('/api/cr/leaderboards/players', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch('https://api.clashroyale.com/v1/leaderboards/players', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Leaderboards API error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboards' });
  }
});

// Add a default player endpoint (for dashboard)
app.get('/api/cr/player/2P0LYQ', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch('https://api.clashroyale.com/v1/players/%232P0LYQ', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Default player API error:', error);
    res.status(500).json({ error: 'Failed to fetch default player' });
  }
});

// Test route for debugging
app.get('/test', (req, res) => {
  res.send('Simple test route working!');
});

// Only handle specific React routes - NO wildcards
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

// Authentication endpoints (placeholder implementations)
app.post('/api/auth/login', requireDatabase, async (req, res) => {
  try {
    const { email_address, password } = req.body;
    
    if (!email_address || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user in database
    const user = await db.User.findOne({ where: { email_address } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password (in production, use bcrypt.compare for hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Successful login
    res.json({ 
      success: true, 
      token: `jwt-${user.user_id}-${Date.now()}`, // Simple token
      user: { 
        id: user.user_id, 
        email: user.email_address,
        username: user.username,
        player_tag: user.player_tag
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/signup', requireDatabase, async (req, res) => {
  try {
    const { email_address, password, username, player_tag } = req.body;
    
    if (!email_address || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username required' });
    }
    
    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email_address } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user in database
    const newUser = await db.User.create({
      email_address,
      password, // In production, you should hash this with bcrypt!
      username,
      player_tag: player_tag || null
    });
    
    res.json({ 
      success: true, 
      message: 'Account created successfully',
      user: {
        id: newUser.user_id,
        email: newUser.email_address,
        username: newUser.username,
        player_tag: newUser.player_tag
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// User data endpoint
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.userId);
    
    if (user) {
      res.json({
        id: user.user_id,
        username: user.username,
        email: user.email_address,
        player_tag: user.player_tag
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('User lookup error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Admin endpoint to view all users (for testing)
app.get('/api/admin/users', requireDatabase, async (req, res) => {
  try {
    console.log('🔍 Attempting to fetch users from database...');
    console.log('Database connection status:', db.sequelize.connectionManager.pool.state);
    
    const users = await db.User.findAll({
      attributes: ['user_id', 'email_address', 'username', 'player_tag', 'created_at'] // Exclude password
    });
    
    console.log(`✅ Found ${users.length} users in database`);
    
    const safeUsers = users.map(user => ({
      id: user.user_id,
      email: user.email_address,
      username: user.username,
      player_tag: user.player_tag,
      created_at: user.created_at
    }));
    
    res.json(safeUsers);
  } catch (error) {
    console.error('❌ Admin users error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      sql: error.sql || 'No SQL query',
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message,
      dbConnected: !!db.sequelize
    });
  }
});

// Deck-related endpoints (mock implementations)
app.get('/api/decks/user/:userId', (req, res) => {
  // Mock user decks
  res.json([]);
});

app.post('/api/decks', (req, res) => {
  // Mock deck creation
  res.json({ success: true, id: Math.floor(Math.random() * 1000) });
});

app.put('/api/decks/:deckId', (req, res) => {
  // Mock deck update
  res.json({ success: true });
});

app.delete('/api/decks/:deckId', (req, res) => {
  // Mock deck deletion
  res.json({ success: true });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Save contact message to database
    await db.ContactMessage.create({
      name,
      email, 
      subject,
      message
    });
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Legacy cards endpoint (for existing deck data)
app.get('/cards', (req, res) => {
  // Return empty array for legacy compatibility
  res.json([]);
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
  console.log(`Safe MetaCrown server running on ${PORT}`);
  console.log(`No wildcard routes - serving React app from: ${path.join(__dirname, 'client')}`);
});