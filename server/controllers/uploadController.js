const path = require('path');

async function upload(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
}

module.exports = { upload };
