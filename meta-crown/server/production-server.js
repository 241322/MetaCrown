import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HARDCODED Database Configuration for Production
const sequelize = new Sequelize('metacrownco_meta_crown_db', 'metacrownco_Xander_Admin', 'Xander@@007@@', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

// Define User Model
const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email_address: { type: DataTypes.STRING(255), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  player_tag: { type: DataTypes.STRING(20), allowNull: true },
  username: { type: DataTypes.STRING(50), allowNull: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define ContactMessage Model  
const ContactMessage = sequelize.define('ContactMessage', {
  message_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  subject: { type: DataTypes.STRING(500), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'contact_messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Database initialization
let dbInitialized = false;

const initializeDatabase = async () => {
  try {
    console.log('🔄 Connecting to database with hardcoded credentials...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    await sequelize.sync();
    console.log('✅ Database synchronized');
    
    dbInitialized = true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

// Initialize database on startup
initializeDatabase();

const app = express();
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client')));

// Middleware to check database initialization
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
    environment: process.env.NODE_ENV || 'production',
    hasClashToken: !!process.env.CLASH_API_TOKEN || !!token,
    dbStatus: dbInitialized ? 'connected' : 'connecting'
  });
});

// Debug endpoint to test Clash API from server IP
app.get('/api/debug/clash-test', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    // Test 1: Cards API
    const cardsResponse = await fetch('https://api.clashroyale.com/v1/cards', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const cardsSuccess = cardsResponse.ok;
    
    // Test 2: Player API  
    const playerResponse = await fetch('https://api.clashroyale.com/v1/players/%232RC0P82YC', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const playerSuccess = playerResponse.ok;
    const playerData = playerSuccess ? await playerResponse.json() : await playerResponse.text();
    
    // Test 3: Leaderboard API (corrected endpoint)
    const leaderResponse = await fetch('https://api.clashroyale.com/v1/rankings/global/players', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const leaderSuccess = leaderResponse.ok;
    
    res.json({
      message: 'Clash API test from server',
      timestamp: new Date().toISOString(),
      serverIP: req.ip || 'unknown',
      tests: {
        cards: { success: cardsSuccess, status: cardsResponse.status },
        player: { success: playerSuccess, status: playerResponse.status, data: playerSuccess ? 'Player found' : playerData },
        leaderboard: { success: leaderSuccess, status: leaderResponse.status }
      },
      tokenInfo: {
        present: !!token,
        length: token ? token.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// New endpoint to check actual outbound IP address
app.get('/api/debug/ip-check', async (req, res) => {
  try {
    // Get our external IP by making a request to an IP checking service
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    
    // Also try another service as backup
    const ip2Response = await fetch('https://httpbin.org/ip');
    const ip2Data = await ip2Response.json();
    
    res.json({
      message: 'IP Address Check',
      timestamp: new Date().toISOString(),
      requestIP: req.ip,
      forwardedFor: req.headers['x-forwarded-for'],
      realIP: req.headers['x-real-ip'],
      outboundIP: {
        ipify: ipData.ip,
        httpbin: ip2Data.origin
      },
      tokenWhitelistedIPs: ['156.38.153.178', '169.0.46.188'],
      allHeaders: req.headers
    });
  } catch (error) {
    res.status(500).json({
      error: 'IP check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    const tableInfo = await sequelize.getQueryInterface().showAllTables();
    
    res.json({
      status: 'connected',
      database: 'metacrownco_meta_crown_db',
      host: 'localhost',
      user: 'metacrownco_Xander_Admin',
      tables: tableInfo,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'disconnected',
      error: error.message,
      database: 'metacrownco_meta_crown_db',
      host: 'localhost',
      user: 'metacrownco_Xander_Admin'
    });
  }
});

// Bcrypt test endpoint (for debugging)
app.get('/api/bcrypt-test', async (req, res) => {
  try {
    const testPassword = 'testpassword123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    
    res.json({
      bcryptWorking: true,
      testPassword: testPassword,
      hashedPassword: hashedPassword,
      verificationSuccess: isValid,
      hashFormat: hashedPassword.startsWith('$2b$') ? 'correct' : 'incorrect'
    });
  } catch (error) {
    res.status(500).json({
      bcryptWorking: false,
      error: error.message
    });
  }
});

// Clash Royale API routes
app.get('/api/cr/cards', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch('https://api.clashroyale.com/v1/cards', {
      headers: { 'Authorization': `Bearer ${token}` }
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
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In0dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch(`https://api.clashroyale.com/v1/players/${encodedTag}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Player API error:', error);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

// Player battles endpoint
app.get('/api/cr/player/:playerTag/battles', async (req, res) => {
  try {
    const { playerTag } = req.params;
    const encodedTag = encodeURIComponent(playerTag);
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    const response = await fetch(`https://api.clashroyale.com/v1/players/${encodedTag}/battlelog`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Player battles API error:', error);
    res.status(500).json({ error: 'Failed to fetch battle data' });
  }
});

// Leaderboards endpoints - using correct Clash Royale API rankings
app.get('/api/cr/leaderboards/players', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    // Use global rankings for players - this is the correct endpoint
    const response = await fetch('https://api.clashroyale.com/v1/rankings/global/players', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Players leaderboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch players leaderboard' });
  }
});

app.get('/api/cr/leaderboards/clans', async (req, res) => {
  try {
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    // Use global rankings for clans - this is the correct endpoint
    const response = await fetch('https://api.clashroyale.com/v1/rankings/global/clans', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Clans leaderboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch clans leaderboard' });
  }
});

// Combined endpoint for faster loading - fetches both player and battles in one call
app.get('/api/cr/player/:playerTag/complete', async (req, res) => {
  try {
    const playerTag = req.params.playerTag;
    const token = process.env.CLASH_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6Ijk0NGRkYzE2LWYzZWMtNGM0OS05NjRmLWU4ZTNkMGEyYjhkMCIsImlhdCI6MTc2MDYwNjQ2NCwic3ViIjoiZGV2ZWxvcGVyL2U2Zjc4Yjc3LWI5OTktNjhlOS0zYjE5LTA5YTJlYTgzZWQxZiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxNTYuMzguMTUzLjE3OCIsIjE2OS4wLjQ2LjE4OCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.VH5K4GfqZtqK5AZLCLBJMTO5U8YOd2vJX06_dLUCKxYCZhsQvsAFzqmyAMEESBtyuFW0cAorUhvWCA-TpRY-Cg';
    
    console.log('Fetching complete player data for:', playerTag);
    
    // Fetch both player and battles in parallel
    const [playerResponse, battlesResponse] = await Promise.all([
      fetch(`https://api.clashroyale.com/v1/players/${playerTag}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      fetch(`https://api.clashroyale.com/v1/players/${playerTag}/battlelog`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);
    
    if (!playerResponse.ok) {
      const errorText = await playerResponse.text();
      console.error('Player fetch failed:', playerResponse.status, errorText);
      return res.status(playerResponse.status).json({ 
        message: 'Player not found', 
        status: playerResponse.status 
      });
    }
    
    const [playerText, battlesText] = await Promise.all([
      playerResponse.text(),
      battlesResponse.text()
    ]);
    
    const playerData = JSON.parse(playerText);
    let battlesData = [];
    
    if (battlesResponse.ok) {
      try {
        battlesData = JSON.parse(battlesText);
      } catch (e) {
        console.error('Failed to parse battles data:', e);
      }
    } else {
      console.error('Battles fetch failed:', battlesResponse.status, battlesText);
    }
    
    res.json({
      player: playerData,
      battles: battlesData
    });
  } catch (error) {
    console.error('Complete player data API error:', error);
    res.status(500).json({ error: 'Failed to fetch complete player data' });
  }
});

// Authentication endpoints
app.post('/api/auth/signup', requireDatabase, async (req, res) => {
  try {
    const { email_address, password, username, player_tag } = req.body;
    
    if (!email_address || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username required' });
    }
    
    // Validate password strength (optional)
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email_address } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password with bcrypt
    const saltRounds = 12; // Higher number = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log('Password hashing:', {
      originalLength: password.length,
      hashedLength: hashedPassword.length,
      startsWithHash: hashedPassword.startsWith('$2b$')
    });
    
    // Create new user in database with hashed password
    const newUser = await User.create({
      email_address,
      password: hashedPassword, // Store hashed password
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
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
});

app.post('/api/auth/login', requireDatabase, async (req, res) => {
  try {
    const { email_address, password } = req.body;
    
    if (!email_address || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user in database
    const user = await User.findOne({ where: { email_address } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if password is hashed (bcrypt hashes start with $2b$)
    let passwordMatch = false;
    
    if (user.password.startsWith('$2b$')) {
      // Password is hashed - use bcrypt to compare
      passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Bcrypt password verification:', { email: email_address, match: passwordMatch });
    } else {
      // Legacy plain text password - compare directly and rehash
      if (user.password === password) {
        passwordMatch = true;
        
        // Rehash the password for better security
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.update(
          { password: hashedPassword },
          { where: { user_id: user.user_id } }
        );
        console.log('Legacy password rehashed for user:', email_address);
      }
    }
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Successful login
    res.json({ 
      success: true, 
      token: `jwt-${user.user_id}-${Date.now()}`,
      user: { 
        id: user.user_id, 
        email: user.email_address,
        username: user.username,
        player_tag: user.player_tag
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// User data endpoint
app.get('/api/users/:userId', requireDatabase, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    
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

// Admin endpoint to view all users
app.get('/api/admin/users', requireDatabase, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'email_address', 'username', 'player_tag', 'password', 'created_at']
    });
    
    const safeUsers = users.map(user => ({
      id: user.user_id,
      email: user.email_address,
      username: user.username,
      player_tag: user.player_tag,
      created_at: user.created_at,
      passwordHashed: user.password.startsWith('$2b$'),
      passwordLength: user.password.length
    }));
    
    res.json(safeUsers);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Admin endpoint to rehash all plain text passwords (GET request for browser access)
app.get('/api/admin/rehash-passwords', requireDatabase, async (req, res) => {
  try {
    const users = await User.findAll();
    let rehashed = 0;
    let alreadyHashed = 0;
    let rehashDetails = [];
    
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // Plain text password - needs hashing
        const originalPassword = user.password;
        const hashedPassword = await bcrypt.hash(user.password, 12);
        await User.update(
          { password: hashedPassword },
          { where: { user_id: user.user_id } }
        );
        rehashed++;
        rehashDetails.push({
          email: user.email_address,
          username: user.username,
          originalLength: originalPassword.length,
          hashedLength: hashedPassword.length,
          status: 'rehashed'
        });
      } else {
        alreadyHashed++;
        rehashDetails.push({
          email: user.email_address,
          username: user.username,
          passwordLength: user.password.length,
          status: 'already_hashed'
        });
      }
    }
    
    res.json({
      success: true,
      totalUsers: users.length,
      passwordsRehashed: rehashed,
      alreadyHashed: alreadyHashed,
      message: `Successfully rehashed ${rehashed} passwords`,
      details: rehashDetails,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Password rehashing error:', error);
    res.status(500).json({ error: 'Failed to rehash passwords', details: error.message });
  }
});

// Keep POST version as well for API clients
app.post('/api/admin/rehash-passwords', requireDatabase, async (req, res) => {
  try {
    const users = await User.findAll();
    let rehashed = 0;
    let alreadyHashed = 0;
    
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {
        // Plain text password - needs hashing
        const hashedPassword = await bcrypt.hash(user.password, 12);
        await User.update(
          { password: hashedPassword },
          { where: { user_id: user.user_id } }
        );
        rehashed++;
      } else {
        alreadyHashed++;
      }
    }
    
    res.json({
      success: true,
      totalUsers: users.length,
      passwordsRehashed: rehashed,
      alreadyHashed: alreadyHashed,
      message: `Successfully rehashed ${rehashed} passwords`
    });
  } catch (error) {
    console.error('Password rehashing error:', error);
    res.status(500).json({ error: 'Failed to rehash passwords', details: error.message });
  }
});

// Contact form endpoint
app.post('/api/contact', requireDatabase, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    await ContactMessage.create({ name, email, subject, message });
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Deck endpoints (mock for now)
app.get('/api/decks/user/:userId', (req, res) => {
  res.json([]);
});

app.post('/api/decks', (req, res) => {
  res.json({ success: true, id: Math.floor(Math.random() * 1000) });
});

app.put('/api/decks/:deckId', (req, res) => {
  res.json({ success: true });
});

app.delete('/api/decks/:deckId', (req, res) => {
  res.json({ success: true });
});

// Legacy cards endpoint
app.get('/cards', (req, res) => {
  res.json([]);
});

// React routes - serve index.html for client-side routing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
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

app.get('/deck-centre', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});