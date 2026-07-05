/**
 * Creates initial admin user. Run once: node db/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { write } = require('./ydb');

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const now = Date.now();

  await write(
    `UPSERT INTO users (id, username, password, role, created_at)
     VALUES ("${id}", "${username}", "${hash}", "admin", ${now});`,
  );

  console.log(`Admin user '${username}' created`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
