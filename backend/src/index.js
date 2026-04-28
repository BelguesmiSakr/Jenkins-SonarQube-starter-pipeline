const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: process.env.APP_VERSION || '1.0.0' });
});

app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
  ]);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  res.status(201).json({ id: 3, name });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app;
