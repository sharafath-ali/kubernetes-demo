const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'pern_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'pern_database',
  password: process.env.DB_PASSWORD || 'pern_password',
  port: process.env.DB_PORT || 5432,
});

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message VARCHAR(255)
  )
`).catch(err => console.error('Error creating table:', err));

// Routes
app.get('/', (req, res) => {
  res.send('PERN Backend API is running!');
});

app.get('/api/requests', async (req, res) => {
  try {
    // Record this request in the DB
    await pool.query('INSERT INTO requests (message) VALUES ($1)', ['Frontend pinged API']);
    
    // Fetch all requests
    const result = await pool.query('SELECT * FROM requests ORDER BY timestamp DESC LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
