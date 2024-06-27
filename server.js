const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.post('/advice', async (req, res) => {
    const { studentId, subject } = req.body;

    try {
        const result = await pool.query('SELECT prerequisites FROM subjects WHERE name = $1', [subject]);
        if (result.rows.length === 0) {
            return res.json({ message: 'Subject not found' });
        }

        const prerequisites = result.rows[0].prerequisites;
        const prereqMessage = prerequisites.length > 0 ? `Prerequisites: ${prerequisites.join(', ')}` : 'No prerequisites';

        // Simulate sending SMS (integrate actual SMS API like Twilio here)
        console.log(`Sending SMS to student ${studentId}: ${prereqMessage}`);

        res.json({ message: `Advice sent: ${prereqMessage}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
