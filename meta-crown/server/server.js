import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './models/index.js'; // Sequelize instance and models
import bcrypt from 'bcrypt';
import { ProxyAgent, setGlobalDispatcher } from 'undici';
import https from 'node:https';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// --- Clash Royale proxy + debug (define BEFORE any app.get('*') fallback) ---
const CLASH_API_BASE = process.env.CLASH_API_BASE || 'https://api.clashroyale.com/v1';
const CLASH_API_TOKEN = process.env.CLASH_API_TOKEN;

const encodeTag = (raw) => {
  const s = (() => { try { return decodeURIComponent(String(raw || '')); } catch { return String(raw || ''); } })();
  const clean = s.trim().replace(/^#+/, '').toUpperCase();
  return `%23${clean}`; // "#TAG" -> "%23TAG"
};

const clashFetch = async (endpoint, res) => {
  if (!CLASH_API_TOKEN) return res.status(500).json({ message: 'CLASH_API_TOKEN missing' });
  const url = `${CLASH_API_BASE}${endpoint}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${CLASH_API_TOKEN}`, Accept: 'application/json' } });
  const body = await r.text();
  if (!r.ok) {
    // forward real error for diagnosis
    try { return res.status(r.status).type('application/json').send(JSON.parse(body)); }
    catch { return res.status(r.status).json({ message: 'Clash API error', status: r.status, body }); }
  }
  try { return res.json(JSON.parse(body)); }
  catch { return res.status(502).json({ message: 'Invalid JSON from Clash API' }); }
};

// Debug: see encoded tag and URL
app.get('/api/cr/debug/:tag', (req, res) => {
  const tag = encodeTag(req.params.tag);
  res.json({ encodedTag: tag, url: `${CLASH_API_BASE}/players/${tag}`, hasToken: !!CLASH_API_TOKEN });
});

// Player proxy
app.get('/api/cr/player/:tag', async (req, res) => {
  const tag = encodeTag(req.params.tag); // pass "2RC0P82YC" here (no '#')
  await clashFetch(`/players/${tag}`, res);
});
// --- end CR routes ---

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

app.get('/api/cr/player/2P0LYQ', async (req, res) => {
  try {
    await clashFetch(`/players/${encodeTag('2P0LYQ')}`, res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch player' });
  }
});

async function getPublicIp() {
  const candidates = [
    { url: 'https://api.ipify.org?format=json', type: 'json', key: 'ip' },
    { url: 'https://checkip.amazonaws.com', type: 'text' },
    { url: 'https://ifconfig.me/ip', type: 'text' },
    { url: 'https://icanhazip.com', type: 'text' },
  ];
  for (const c of candidates) {
    try {
      const r = await fetch(c.url, { headers: { 'User-Agent': 'MetaCrown/1.0' }, cache: 'no-store' });
      if (!r.ok) continue;
      if (c.type === 'json') {
        const j = await r.json();
        const ip = (c.key ? j[c.key] : j.ip) || '';
        if (ip) return ip.trim();
      } else {
        const t = (await r.text()).trim();
        if (t) return t;
      }
    } catch (_) {}
  }
  // Fallback using https module
  return await new Promise((resolve, reject) => {
    const req = https.request('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (ch) => (data += ch));
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          resolve((j.ip || '').trim());
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => req.destroy(new Error('timeout')));
    req.end();
  });
}

app.get('/api/egress-ip', async (req, res) => {
  try {
    const ip = await getPublicIp();
    if (!ip) throw new Error('No IP resolved');
    res.json({ ip });
  } catch (e) {
    console.error('egress-ip failed:', e);
    res.status(500).json({ message: 'Failed to resolve egress IP', error: String(e.message || e) });
  }
});