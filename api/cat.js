const https = require('https');

module.exports = async (req, res) => {
  const apiKey = process.env.CAT_API_KEY;

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
        res.status(200).json(parsed);
      } catch (err) {
        console.error('Parse error:', err);
        res.status(500).json({ error: 'Failed to parse cat image response.' });
      }
    });
  }).on('error', err => {
    console.error('API fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch cat image.' });
  });
};
