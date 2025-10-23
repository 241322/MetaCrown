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

app.get('/api/cr/cards', async (req, res) => {
  try {
    await clashFetch('/cards', res);
  } catch (e) {
    console.error('CR cards fetch error:', e);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

app.get('/api/cr/player/:tag/battles', async (req, res) => {
  try {
    const tagNoHash = String(req.params.tag || "").replace(/^#+/, "");
    const encodedTag = `%23${tagNoHash.toUpperCase()}`;
    const url = `${CLASH_API_BASE}/players/${encodedTag}/battlelog`;
    
    console.log('Fetching battlelog from:', url);
    
    const r = await fetch(url, { 
      headers: { 
        Authorization: `Bearer ${CLASH_API_TOKEN}`, 
        Accept: 'application/json' 
      } 
    });
    
    const text = await r.text();
    console.log('Battlelog response status:', r.status);
    
    if (!r.ok) {
      try { 
        return res.status(r.status).type('application/json').send(JSON.parse(text)); 
      }
      catch { 
        return res.status(r.status).json({ message: 'Clash API error', status: r.status, body: text }); 
      }
    }
    
    try { 
      const battleData = JSON.parse(text);
      console.log('First battle data:', JSON.stringify(battleData[0], null, 2));
      return res.json(battleData); 
    }
    catch { 
      return res.status(502).json({ message: 'Invalid JSON from Clash API' }); 
    }
  } catch (e) {
    console.error('CR battlelog fetch error:', e);
    res.status(500).json({ message: 'Failed to fetch battlelog' });
  }
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
    
    // Sync database tables (create if they don't exist)
    await db.sequelize.sync({ alter: true });
    console.log('Database tables synchronized');
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

// Test endpoint to check deck model
app.get('/api/decks/test', async (req, res) => {
  try {
    console.log('Testing deck model...');
    const testCards = [
      { id: 1, name: 'Test Card 1', elixirCost: 3 },
      { id: 2, name: 'Test Card 2', elixirCost: 4 },
      { id: 3, name: 'Test Card 3', elixirCost: 2 },
      { id: 4, name: 'Test Card 4', elixirCost: 5 },
      { id: 5, name: 'Test Card 5', elixirCost: 1 },
      { id: 6, name: 'Test Card 6', elixirCost: 3 },
      { id: 7, name: 'Test Card 7', elixirCost: 4 },
      { id: 8, name: 'Test Card 8', elixirCost: 2 }
    ];

    const testDeck = await db.Deck.create({
      user_id: 1,
      deck_name: 'Test Deck ' + Date.now(),
      cards: testCards,
      avg_elixir: 3.0,
      avg_attack: 7,
      avg_defense: 6,
      avg_f2p: 8
    });

    console.log('Test deck created:', testDeck.deck_id);
    res.json({ success: true, deck: testDeck });
  } catch (e) {
    console.error('Test deck creation failed:', e);
    res.status(500).json({ error: e.message, details: e });
  }
});

// Deck CRUD endpoints
// Save a new deck
app.post('/api/decks', async (req, res) => {
  try {
    console.log('Deck save request received:', req.body);
    const { user_id, deck_name, cards, avg_elixir, avg_attack, avg_defense, avg_f2p } = req.body;
    
    if (!user_id || !deck_name || !cards || !Array.isArray(cards) || cards.length !== 8) {
      console.log('Validation failed:', { user_id, deck_name, cardsLength: cards?.length });
      return res.status(400).json({ message: 'Missing required fields or invalid deck data' });
    }

    // Check if deck name already exists for this user
    const existingDeck = await db.Deck.findOne({ 
      where: { 
        user_id: user_id, 
        deck_name: deck_name 
      } 
    });
    
    if (existingDeck) {
      console.log('Deck name already exists for user:', user_id, deck_name);
      return res.status(409).json({ message: 'Deck name already exists. Please choose a different name.' });
    }

    console.log('Creating deck with data:', {
      user_id,
      deck_name,
      cardsCount: cards.length,
      avg_elixir,
      avg_attack,
      avg_defense,
      avg_f2p
    });

    const deck = await db.Deck.create({
      user_id,
      deck_name,
      cards,
      avg_elixir,
      avg_attack,
      avg_defense,
      avg_f2p
    });

    console.log('Deck created successfully:', deck.deck_id);

    res.status(201).json({
      deck_id: deck.deck_id,
      deck_name: deck.deck_name,
      cards: deck.cards,
      avg_elixir: deck.avg_elixir,
      created_at: deck.created_at
    });
  } catch (e) {
    console.error('Save deck error:', e.message, e.original?.sqlMessage);
    console.error('Full error:', e);
    res.status(500).json({ message: 'Failed to save deck', detail: e.original?.sqlMessage || e.message });
  }
});

// Get all decks for a user
app.get('/api/decks/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const decks = await db.Deck.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });

    res.json(decks);
  } catch (e) {
    console.error('Get user decks error:', e.message);
    res.status(500).json({ message: 'Failed to fetch decks', detail: e.message });
  }
});

// Update an existing deck
app.put('/api/decks/:deckId', async (req, res) => {
  try {
    const { deckId } = req.params;
    const { user_id, deck_name, cards, avg_elixir, avg_attack, avg_defense, avg_f2p } = req.body;
    
    const deck = await db.Deck.findOne({
      where: { 
        deck_id: deckId,
        user_id: user_id // Ensure user can only update their own decks
      }
    });
    
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found or unauthorized' });
    }

    // Check if new deck name conflicts with existing deck (exclude current deck)
    if (deck_name && deck_name !== deck.deck_name) {
      const existingDeck = await db.Deck.findOne({ 
        where: { 
          user_id: user_id, 
          deck_name: deck_name,
          deck_id: { [db.Sequelize.Op.ne]: deckId }
        } 
      });
      
      if (existingDeck) {
        return res.status(409).json({ message: 'Deck name already exists. Please choose a different name.' });
      }
    }

    const updatedDeck = await deck.update({
      deck_name: deck_name || deck.deck_name,
      cards: cards || deck.cards,
      avg_elixir: avg_elixir !== undefined ? avg_elixir : deck.avg_elixir,
      avg_attack: avg_attack !== undefined ? avg_attack : deck.avg_attack,
      avg_defense: avg_defense !== undefined ? avg_defense : deck.avg_defense,
      avg_f2p: avg_f2p !== undefined ? avg_f2p : deck.avg_f2p
    });

    res.json(updatedDeck);
  } catch (e) {
    console.error('Update deck error:', e.message);
    res.status(500).json({ message: 'Failed to update deck', detail: e.message });
  }
});

// Delete a deck
app.delete('/api/decks/:deckId', async (req, res) => {
  try {
    const { deckId } = req.params;
    const { user_id } = req.body;
    
    const deck = await db.Deck.findOne({
      where: { 
        deck_id: deckId,
        user_id: user_id // Ensure user can only delete their own decks
      }
    });
    
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found or unauthorized' });
    }

    await deck.destroy();
    res.json({ message: 'Deck deleted successfully' });
  } catch (e) {
    console.error('Delete deck error:', e.message);
    res.status(500).json({ message: 'Failed to delete deck', detail: e.message });
  }
});