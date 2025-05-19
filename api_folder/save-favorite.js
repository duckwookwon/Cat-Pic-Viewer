const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const { url } = JSON.parse(body);
      if (!url) {
        console.log('No URL received');
        return res.status(400).send({ error: 'Missing image URL' });
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert([{ url }]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Inserted:', data);
      res.status(200).json({ message: 'Saved to Supabase', data });
    } catch (err) {
      console.error('Body parse error:', err);
      res.status(500).json({ error: 'Invalid JSON' });
    }
  });
};
