const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid input. Please provide valid URLs.' });
    }

    const uniqueNumbers = new Set();

    const fetchUrls = urls.map(async (url) => {
        try {
            const response = await axios.get(url, { timeout: 500 });
            if (response.status === 200 && Array.isArray(response.data.numbers)) {
                response.data.numbers.forEach((number) => {
                    uniqueNumbers.add(number);
                });
            }
        } catch (error) {
            
            console.error(`Error fetching ${url}: ${error.message}`);
        }
    });

    try {
        await Promise.all(fetchUrls);
    } catch (error) {
        console.error(`Error fetching URLs: ${error.message}`);
    }

    const mergedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
    res.json({ numbers: mergedNumbers });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
