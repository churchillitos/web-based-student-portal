const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dummy data for demonstration purposes
const subjects = {
    "Math101": { prerequisites: [] },
    "Sci102": { prerequisites: ["Math101"] },
    // Add more subjects and their prerequisites here
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/advice', (req, res) => {
    const { studentId, subject } = req.body;

    if (!subjects[subject]) {
        return res.json({ message: 'Subject not found' });
    }

    const prerequisites = subjects[subject].prerequisites;
    const prereqMessage = prerequisites.length > 0 ? `Prerequisites: ${prerequisites.join(', ')}` : 'No prerequisites';

    // Simulate sending SMS (integrate actual SMS API like Twilio here)
    console.log(`Sending SMS to student ${studentId}: ${prereqMessage}`);

    res.json({ message: `Advice sent: ${prereqMessage}` });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
