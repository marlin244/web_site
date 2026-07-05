const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { execute } = require('../db/ydb');

const READ_TX = { beginTx: { onlineReadOnly: {} }, commitTx: true };

const USER_COLS = [
  { name: 'id', type: 'text' },
  { name: 'username', type: 'text' },
  { name: 'password', type: 'text' },
  { name: 'role', type: 'text' },
];

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const rows = await execute(
      `SELECT id, username, password, role FROM users WHERE username = "${esc(username)}" LIMIT 1;`,
      USER_COLS,
      READ_TX,
    );

    const user = rows[0] || null;
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, me };
