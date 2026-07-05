const { Driver, IamAuthService, AnonymousAuthService, TypedValues } = require('ydb-sdk');
const path = require('path');

let driver = null;

async function getDriver() {
  if (driver) return driver;

  const endpoint = process.env.YDB_ENDPOINT;
  const database = process.env.YDB_DATABASE;

  if (!endpoint || !database) {
    throw new Error('YDB_ENDPOINT and YDB_DATABASE must be set in environment');
  }

  let authService;
  const keyFile = process.env.YDB_SA_KEY_FILE;
  if (keyFile) {
    const saKey = require(path.resolve(keyFile));
    authService = new IamAuthService({
      accessKeyId: saKey.id,
      serviceAccountId: saKey.service_account_id,
      privateKey: saKey.private_key,
      iamEndpoint: 'https://iam.api.cloud.yandex.net',
    });
  } else {
    authService = new AnonymousAuthService();
  }

  driver = new Driver({ endpoint, database, authService });

  const timeout = 10000;
  if (!(await driver.ready(timeout))) {
    throw new Error(`YDB driver failed to connect within ${timeout}ms`);
  }

  return driver;
}

// Execute a query and return rows as plain JS objects
// columns: array of { name, type } where type is 'text'|'bool'|'uint64'
async function execute(sql, columns = [], txControl = null) {
  const d = await getDriver();
  const rows = [];

  await d.tableClient.withSession(async (session) => {
    const tx = txControl || { beginTx: { onlineReadOnly: {} }, commitTx: true };
    const result = await session.executeQuery(sql, {}, tx);
    const rs = result.resultSets?.[0];
    if (!rs) return;
    for (const row of rs.rows || []) {
      const obj = {};
      columns.forEach((col, i) => {
        const item = row.items?.[i];
        if (!item) { obj[col.name] = null; return; }
        if (col.type === 'bool')   obj[col.name] = item.boolValue ?? false;
        else if (col.type === 'uint64') obj[col.name] = Number(item.uint64Value ?? 0);
        else obj[col.name] = item.textValue ?? '';
      });
      rows.push(obj);
    }
  });

  return rows;
}

// Execute a write query (INSERT / UPDATE / DELETE / UPSERT)
async function write(sql) {
  const d = await getDriver();
  await d.tableClient.withSession(async (session) => {
    await session.executeQuery(sql, {}, { beginTx: { serializableReadWrite: {} }, commitTx: true });
  });
}

// Execute a DDL query (CREATE TABLE etc.)
async function ddl(sql) {
  const d = await getDriver();
  await d.tableClient.withSession(async (session) => {
    await session.executeQuery(sql, {}, { beginTx: { serializableReadWrite: {} }, commitTx: true });
  });
}

module.exports = { getDriver, execute, write, ddl };
