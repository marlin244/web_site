const { v4: uuidv4 } = require('uuid');
const { execute, write } = require('../db/ydb');

const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
const READ_TX = { beginTx: { onlineReadOnly: {} }, commitTx: true };

const WORK_COLS = [
  { name: 'id', type: 'text' },
  { name: 'title', type: 'text' },
  { name: 'description', type: 'text' },
  { name: 'image_url', type: 'text' },
  { name: 'category', type: 'text' },
  { name: 'created_at', type: 'uint64' },
];

async function list(req, res) {
  try {
    const where = req.query.category ? `WHERE category = "${esc(req.query.category)}"` : '';
    const works = await execute(
      `SELECT id, title, description, image_url, category, created_at FROM works ${where} ORDER BY created_at DESC;`,
      WORK_COLS,
      READ_TX,
    );
    res.json(works);
  } catch (err) {
    console.error('works.list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  const { title, description, image_url, category } = req.body;
  if (!title || !image_url) return res.status(400).json({ error: 'title and image_url are required' });

  try {
    const id = uuidv4();
    const now = Date.now();
    await write(
      `UPSERT INTO works (id, title, description, image_url, category, created_at)
       VALUES ("${id}", "${esc(title)}", "${esc(description)}", "${esc(image_url)}", "${esc(category)}", ${now});`,
    );
    res.status(201).json({ id, title, description, image_url, category, created_at: now });
  } catch (err) {
    console.error('works.create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    await write(`DELETE FROM works WHERE id = "${esc(req.params.id)}";`);
    res.json({ ok: true });
  } catch (err) {
    console.error('works.remove error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { list, create, remove };
