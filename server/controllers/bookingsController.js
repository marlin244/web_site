const { v4: uuidv4 } = require('uuid');
const { execute, write } = require('../db/ydb');

const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
const READ_TX = { beginTx: { onlineReadOnly: {} }, commitTx: true };

const BOOKING_COLS = [
  { name: 'id', type: 'text' },
  { name: 'name', type: 'text' },
  { name: 'phone', type: 'text' },
  { name: 'service', type: 'text' },
  { name: 'date', type: 'text' },
  { name: 'time_slot', type: 'text' },
  { name: 'comment', type: 'text' },
  { name: 'status', type: 'text' },
  { name: 'vk_notified', type: 'bool' },
  { name: 'created_at', type: 'uint64' },
];

async function list(req, res) {
  try {
    const where = req.query.status ? `WHERE status = "${esc(req.query.status)}"` : '';
    const bookings = await execute(
      `SELECT id, name, phone, service, date, time_slot, comment, status, vk_notified, created_at
       FROM bookings ${where} ORDER BY created_at DESC;`,
      BOOKING_COLS,
      READ_TX,
    );
    res.json(bookings);
  } catch (err) {
    console.error('bookings.list error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function create(req, res) {
  const { name, phone, service, date, time_slot, comment } = req.body;
  if (!name || !phone || !service || !date || !time_slot) {
    return res.status(400).json({ error: 'name, phone, service, date, time_slot are required' });
  }

  try {
    const id = uuidv4();
    const now = Date.now();
    await write(
      `UPSERT INTO bookings (id, name, phone, service, date, time_slot, comment, status, vk_notified, created_at)
       VALUES ("${id}", "${esc(name)}", "${esc(phone)}", "${esc(service)}", "${esc(date)}", "${esc(time_slot)}", "${esc(comment)}", "new", false, ${now});`,
    );
    res.status(201).json({ id, name, phone, service, date, time_slot, comment, status: 'new', vk_notified: false, created_at: now });
  } catch (err) {
    console.error('bookings.create error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ['new', 'confirmed', 'cancelled', 'done'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${allowed.join(', ')}` });
  }

  try {
    await write(`UPDATE bookings SET status = "${status}" WHERE id = "${esc(req.params.id)}";`);
    res.json({ ok: true, status });
  } catch (err) {
    console.error('bookings.updateStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { list, create, updateStatus };
