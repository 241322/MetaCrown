import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'meta_crown_db'
})

app.get('/api/test', (req, res) => {
  return res.json("From Backend Side, API is working fine");
});

app.get('/cards', (req, res) => {
  const sql = "SELECT * FROM cards";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
})

const PORT = 6969;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));