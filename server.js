require('dotenv').config();
const express = require('express');
const cors = require('cors');
// If you are on Node v18+, you don't even need node-fetch! 
// But if you do, this wrapper handles both versions:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());

app.get('/api/contributions', async (req, res) => {
    console.log("Server received request for contributions...");

    const query = JSON.stringify({
        query: `{
            user(login: "${process.env.USERNAME}") {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }`
    });

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'NodeJS-Server' // GitHub sometimes requires a User-Agent
            },
            body: query,
        });

        const data = await response.json();

        if (data.errors) {
            console.error("GitHub API Error Details:", data.errors);
            return res.status(500).json({ error: "GitHub API error", details: data.errors });
        }

        console.log("Success: Data fetched from GitHub");
        res.json(data);

    } catch (err) {
        console.error("Server Crash Detail:", err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));