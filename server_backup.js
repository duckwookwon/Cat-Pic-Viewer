require('dotenv').config();
const express = require('express');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/api/cat', (req, res) => {
    const apiKey = 'live_rMSCFw1PR8O5qQD0zZOaCJD9HYKcw4BGs3RAPSJnG1mHxwZqh2psBvY2Eo3zROyq'; 
    const options = {
        hostname: 'api.thecatapi.com',
        path: '/v1/images/search',
        headers: { 'x-api-key': apiKey }
    };

    https.get(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                res.send(parsed);
                console.log('Got cat pic:', parsed[0]?.url);
            } catch (err) {
                console.error('JSON parse error:', err);
                res.status(500).send({ error: 'Failed to parse cat image response.' });
            }
        });
    }).on('error', err => {
        console.error('API fetch error:', err.message);
        res.status(500).send({ error: 'Failed to fetch cat image.' });
    });
});

app.post('/api/save-favorite', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).send({ error: 'Missing image URL' });

    const { data, error } = await supabase
        .from('favorites')
        .insert([{ url }]);

    if (error) return res.status(500).send({ error: error.message });
    res.send({ message: 'Saved to Supabase', data });
});

app.get('/api/get-favorites', async (req, res) => {
    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).send({ error: error.message });
    res.send(data);
});

app.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});

app.get('/api/test-supabase', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select('*');
  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).send({ error: error.message });
  }
  res.send(data);
});

app.post('/api/save-favorite', async (req, res) => {
    const { url } = req.body;
    console.log('Incoming POST:', url);

    if (!url) {
        console.log('No URL received');
        return res.status(400).send({ error: 'Missing image URL' });
    }

    const { data, error } = await supabase
        .from('favorites')
        .insert([{ url }]);  // 👈 여기에 'url'이 정확히 테이블 컬럼명이랑 일치해야 함

    if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).send({ error: error.message });
    }

    console.log('Inserted:', data);
    res.send({ message: 'Saved to Supabase', data });
});
