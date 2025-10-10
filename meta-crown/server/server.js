import express from 'express';
import cors from 'cors';
// Prefer built-in parsers over body-parser
import db from './models/index.js'; // Sequelize instance and models
import path from 'path';
import { fileURLToPath } from 'url';

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

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));