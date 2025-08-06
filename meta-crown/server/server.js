import express from 'express';
import cors from 'cors';
import db from './models/index.js';

const app = express();

db.sequelize.sync().then(() => {
  console.log("Database synced");
});

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));