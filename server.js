// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors()); // This allows your HTML to talk to this server

const PORT = 3000;

app.get('/api/contributions', async (req, res) => {
    const query = `
    {
      user(login: "${process.env.USERNAME}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { contributionCount date } }
          }
        }
      }
    }`;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        res.json(data); // Send ONLY the data to the browser
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
});

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));