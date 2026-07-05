const { v4: uuidv4 } = require('uuid');
const { execute, write } = require('../db/ydb');

const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

const READ_TX  = { beginTx: { onlineReadOnly: {} }, commitTx: true };
const WRITE_TX = { beginTx: { serializableReadWrite: {} }, commitTx: true };

const LIST_COLS = [
  { name: 'id', type: 'text' },
  { name: 'title', type: 'text' },
  { name: 'preview', type: 'text' },
  { name: 'image_url', type: 'text' },
  { name: 'published', type: 'bool' },
  { name: 'created_at', type: 'uint64' },
];

const FULL_COLS = [
  { name: 'id', type: 'text' },
  { name: 'title', type: 'text' },
  { name: 'body', type: 'text' },
  { name: 'preview', type: 'text' },
  { name: 'image_url', type: 'text' },
  { name: 'published', type: 'bool' },
  { name: 'created_at', type: 'uint64' },
  { name: 'updated_at', type: 'uint64' },
];

async function list(req, res) {
  try {
    const onlyPublished = req.query.published !== 'false' && !req.user;
    const where = onlyPublished ? 'WHERE published = true' : '';
    const posts = await execute(
      `SELECT id, title, preview, image_url, published, created_at FROM posts ${where} ORDER BY created_at DESC;`,
      LIST_COLS,
      READ_TX,
    );
    res.json(posts);
  } catch (err) {
    console.error('posts.list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOne(req, res) {
  try {
    const rows = await execute(
      `SELECT id, title, body, preview, image_url, published, created_at, updated_at
       FROM posts WHERE id = "${esc(req.params.id)}" LIMIT 1;`,
      FULL_COLS,
      READ_TX,
    );
    const post = rows[0] || null;
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (!post.published && !req.user) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    console.error('posts.getOne error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  const { title, body, preview, image_url, published } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });

  try {
    const id = uuidv4();
    const now = Date.now();
    await write(
      `UPSERT INTO posts (id, title, body, preview, image_url, published, created_at, updated_at)
       VALUES ("${id}", "${esc(title)}", "${esc(body)}", "${esc(preview)}", "${esc(image_url)}", ${!!published}, ${now}, ${now});`,
    );
    res.status(201).json({ id, title, body, preview, image_url, published: !!published, created_at: now, updated_at: now });
  } catch (err) {
    console.error('posts.create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  const { title, body, preview, image_url, published } = req.body;
  try {
    const now = Date.now();
    await write(
      `UPDATE posts SET
         title = "${esc(title)}",
         body = "${esc(body)}",
         preview = "${esc(preview)}",
         image_url = "${esc(image_url)}",
         published = ${!!published},
         updated_at = ${now}
       WHERE id = "${esc(req.params.id)}";`,
    );
    res.json({ id: req.params.id, updated_at: now });
  } catch (err) {
    console.error('posts.update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    await write(`DELETE FROM posts WHERE id = "${esc(req.params.id)}";`);
    res.json({ ok: true });
  } catch (err) {
    console.error('posts.remove error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { list, getOne, create, update, remove };
