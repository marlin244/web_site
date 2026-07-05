/**
 * Creates all required YDB tables. Run once: node db/migrate.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getDriver } = require('./ydb');

const WRITE_TX = { beginTx: { serializableReadWrite: {} }, commitTx: true };

const tables = [
  {
    name: 'users',
    ddl: `CREATE TABLE users (
      id         Utf8,
      username   Utf8,
      password   Utf8,
      role       Utf8,
      created_at Uint64,
      PRIMARY KEY (id)
    );`,
  },
  {
    name: 'posts',
    ddl: `CREATE TABLE posts (
      id         Utf8,
      title      Utf8,
      body       Utf8,
      preview    Utf8,
      image_url  Utf8,
      published  Bool,
      created_at Uint64,
      updated_at Uint64,
      PRIMARY KEY (id)
    );`,
  },
  {
    name: 'works',
    ddl: `CREATE TABLE works (
      id          Utf8,
      title       Utf8,
      description Utf8,
      image_url   Utf8,
      category    Utf8,
      created_at  Uint64,
      PRIMARY KEY (id)
    );`,
  },
  {
    name: 'bookings',
    ddl: `CREATE TABLE bookings (
      id          Utf8,
      name        Utf8,
      phone       Utf8,
      service     Utf8,
      date        Utf8,
      time_slot   Utf8,
      comment     Utf8,
      status      Utf8,
      vk_notified Bool,
      created_at  Uint64,
      PRIMARY KEY (id)
    );`,
  },
];

async function migrate() {
  const driver = await getDriver();

  await driver.tableClient.withSession(async (session) => {
    for (const table of tables) {
      try {
        await session.executeQuery(table.ddl, {}, WRITE_TX);
        console.log(`✓ Table '${table.name}' created`);
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('already exists')) {
          console.log(`  Table '${table.name}' already exists — skipping`);
        } else {
          throw err;
        }
      }
    }
  });

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
