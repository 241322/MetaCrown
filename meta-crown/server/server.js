import express from 'express';
import cors from 'cors';
// Prefer built-in parsers over body-parser
import db from './models/index.js'; // Sequelize instance and models
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve card assets (optional; helps client load images by URL)
app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'src', 'Assets')));

// Example health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Example cards endpoint using Sequelize (adjust to your model name)
app.get('/cards', async (req, res) => {
  try {
    const rows = await db.sequelize.query('SELECT * FROM cards', { type: db.Sequelize.QueryTypes.SELECT });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

// Verify DB connection on start
const PORT = process.env.PORT || 6969;
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('DB connected');
  } catch (e) {
    console.error('DB connection failed:', e.message);
  }
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})();

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email_address, password, username, player_tag } = req.body;
    if (!email_address || !password || !username || !player_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const exists = await db.User.findOne({ where: { email_address } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({ email_address, password: hash, username, player_tag });

    res.json({
      user_id: user.user_id,
      email_address: user.email_address,
      username: user.username,
      player_tag: user.player_tag,
    });
  } catch (e) {
    console.error('Signup error:', e.message, e.original?.sqlMessage);
    res.status(500).json({ message: 'Signup failed', detail: e.original?.sqlMessage || e.message });
  }
});

// Log In
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email_address, password } = req.body;
    if (!email_address || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    const user = await db.User.findOne({ where: { email_address } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      user_id: user.user_id,
      email_address: user.email_address,
      username: user.username,
      player_tag: user.player_tag,
    });
  } catch (e) {
    console.error('Login error:', e.message, e.original?.sqlMessage);
    res.status(500).json({ message: 'Login failed', detail: e.original?.sqlMessage || e.message });
  }
});