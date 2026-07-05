const router = require('express').Router();
const { execute, write } = require('../db/ydb');

const PENDING_COLS = [
  { name: 'id', type: 'text' },
  { name: 'name', type: 'text' },
  { name: 'phone', type: 'text' },
  { name: 'service', type: 'text' },
  { name: 'date', type: 'text' },
  { name: 'time_slot', type: 'text' },
  { name: 'comment', type: 'text' },
  { name: 'created_at', type: 'uint64' },
];

// VK sends a GET with ?type=confirmation to verify the server
router.get('/', (req, res) => {
  res.send(process.env.VK_CONFIRMATION_CODE || 'ok');
});

// VK sends POST events; also used by the bot to fetch pending notifications
router.post('/', async (req, res) => {
  const secret = process.env.VK_WEBHOOK_SECRET;
  if (secret && req.body.secret !== secret) {
    return res.status(403).send('forbidden');
  }

  if (req.body.type === 'confirmation') {
    return res.send(process.env.VK_CONFIRMATION_CODE || 'ok');
  }

  if (req.body.type === 'get_pending') {
    try {
      const bookings = await execute(
        `SELECT id, name, phone, service, date, time_slot, comment, created_at
         FROM bookings WHERE vk_notified = false AND status = "new"
         ORDER BY created_at ASC;`,
        PENDING_COLS,
        { beginTx: { onlineReadOnly: {} }, commitTx: true },
      );

      for (const b of bookings) {
        await write(`UPDATE bookings SET vk_notified = true WHERE id = "${b.id}";`);
      }

      return res.json({ bookings });
    } catch (err) {
      console.error('webhook error:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  res.send('ok');
});

module.exports = router;
