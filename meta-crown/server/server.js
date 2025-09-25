import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Twilio Credentials
const accountSID = 'ACa82ed20293b580ecc9c1232a42b6fe44';
const authToken = '63e4ad0312e6185c617736dfbb6294c7';
const twilioClient = twilio(accountSID, authToken);
const otpStore = {};

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phoneNumber] = otp;

  Client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: 

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