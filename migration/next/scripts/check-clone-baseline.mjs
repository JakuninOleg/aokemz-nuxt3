import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import pg from 'pg';

// LOCAL CLONE ONLY. Never loads .env; never uses remote DATABASE_URL or Payload.
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const privateRoot = path.resolve(app, '../../.migration-private');
const root = path.resolve(privateRoot, process.env.KEMZ_RELEASE_BACKUP_DIR || 'release-restore-20261008');
if (path.dirname(root) !== privateRoot) throw new Error('Clone must use a direct private workspace directory');
const data = path.join(root, 'postgres');
const bin = path.join(app, 'node_modules/@embedded-postgres/windows-x64/native/bin');
const names = ['20261007_221720_initial', '20261008_105450_leads'];
const output = path.join(root, 'baseline.log');
const log = value => fs.appendFile(output, `${JSON.stringify(value)}\n`);
const password = crypto.randomBytes(24).toString('hex');
function tool(name, args, input, environment) {
  return new Promise((resolve, reject) => {
    const executable = name === 'pg_restore.exe' && process.env.PG_RESTORE_BIN ? process.env.PG_RESTORE_BIN : path.join(bin, name);
    const child = spawn(executable, args, { env: environment, windowsHide: true, stdio: ['pipe', 'ignore', 'pipe'] });
    child.stderr.resume();
    const timer = setTimeout(() => child.kill(), 60_000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error(`${name}_exit_${code}`)); });
    child.stdin.end(input || '');
  });
}
async function schema(client) {
  const columns = await client.query(`SELECT c.relname AS table_name,a.attname AS column_name,
    format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull AS not_null,
    pg_get_expr(d.adbin,d.adrelid) AS default_value FROM pg_attribute a
    JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname='public' AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped
    ORDER BY c.relname,a.attname`);
  const constraints = await client.query(`SELECT c.relname AS table_name,p.conname AS name,
    pg_get_constraintdef(p.oid) AS definition FROM pg_constraint p
    JOIN pg_class c ON c.oid=p.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname='public' ORDER BY c.relname,p.conname`);
  const indexes = await client.query(`SELECT tablename,indexname,indexdef FROM pg_indexes
    WHERE schemaname='public' ORDER BY tablename,indexname`);
  const enums = await client.query(`SELECT t.typname,e.enumlabel,e.enumsortorder FROM pg_type t
    JOIN pg_enum e ON e.enumtypid=t.oid JOIN pg_namespace n ON n.oid=t.typnamespace
    WHERE n.nspname='public' ORDER BY t.typname,e.enumsortorder`);
  return { columns: columns.rows, constraints: constraints.rows, indexes: indexes.rows, enums: enums.rows };
}
async function counts(client) {
  const tables = (await client.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`)).rows;
  const result = {};
  for (const { tablename } of tables) result[tablename] = (await client.query(`SELECT count(*)::int AS n FROM "${tablename.replaceAll('"', '""')}"`)).rows[0].n;
  return result;
}
let started = false;
let restored;
let expected;
let admin;
try {
  await fs.access(path.join(data, 'PG_VERSION'));
  // Reset only the local cluster role in single-user mode while the server is stopped.
  await tool('postgres.exe', ['--single', '-D', data, 'postgres'], `ALTER ROLE restore_user PASSWORD '${password}';\n`);
  const reserve = net.createServer();
  await new Promise(resolve => reserve.listen(0, '127.0.0.1', resolve));
  const port = reserve.address().port;
  await new Promise(resolve => reserve.close(resolve));
  // pg_ctl cannot create another restricted token in the Codex Windows sandbox.
  // Start postgres directly as the existing unprivileged user instead.
  const serverLog = await fs.open(path.join(root, 'baseline-postgres.log'), 'a');
  const localServer = spawn(path.join(bin, 'postgres.exe'), ['-D', data, '-h', '127.0.0.1', '-p', String(port)],
    { windowsHide: true, stdio: ['ignore', serverLog.fd, serverLog.fd] });
  await serverLog.close();
  let exited = false;
  localServer.once('exit', () => { exited = true; });
  const until = Date.now() + 30_000;
  while (true) {
    const probe = new pg.Client({ host: '127.0.0.1', port, user: 'restore_user', password,
      database: 'postgres', connectionTimeoutMillis: 1000 });
    const ready = await probe.connect().then(() => true, () => false);
    await probe.end().catch(() => {});
    if (ready) break;
    if (exited || Date.now() >= until) throw new Error('local_postgres_start_failed');
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  started = true;
  const client = database => new pg.Client({ host: '127.0.0.1', port, user: 'restore_user', password, database });
  admin = client('postgres'); await admin.connect();
  if (process.argv.includes('--restore-first')) {
    // An explicit fresh clone restore; no existing DB is overwritten or dropped.
    const exists = (await admin.query("SELECT 1 FROM pg_database WHERE datname='kemz_restore'")).rowCount;
    if (!exists) await admin.query('CREATE DATABASE kemz_restore');
    else {
      const empty = client('kemz_restore');
      try {
        await empty.connect();
        if ((await empty.query("SELECT 1 FROM pg_tables WHERE schemaname='public'")).rowCount) throw new Error('Clone already has tables; refusing overwrite');
      } finally { await empty.end(); }
    }
    await tool('pg_restore.exe', ['--exit-on-error', '--no-owner', '--no-acl', '--host', '127.0.0.1',
      '--port', String(port), '--username', 'restore_user', '--dbname', 'kemz_restore', path.join(root, 'kemz-staging.dump')],
    undefined, { ...process.env, PGPASSWORD: password, PGSSLMODE: 'disable' });
    const checked = client('kemz_restore');
    try {
      await checked.connect();
      const expectedCounts = JSON.parse(await fs.readFile(path.join(root, 'expected.json'), 'utf8')).expected;
      const actualCounts = await counts(checked);
      if (Object.entries(expectedCounts).some(([table, n]) => actualCounts[table] !== n)) throw new Error('restored_counts_mismatch');
      await log({ freshRestorePassed: true, expectedCounts, localOnly: true });
    } finally { await checked.end(); }
  }
  // A new empty expected-schema DB: initial CREATE is never sent to restored clone.
  const expectedName = `kemz_expected_schema_${Date.now()}`;
  await admin.query(`CREATE DATABASE "${expectedName}"`);
  expected = client(expectedName); await expected.connect();
  for (const name of names) {
    const source = await fs.readFile(path.join(app, 'src/migrations', `${name}.ts`), 'utf8');
    const up = source.match(/await db\.execute\(sql`([\s\S]*?)`\)/)?.[1];
    if (!up || up.includes('${')) throw new Error('migration_up_not_static');
    await expected.query(up);
  }
  restored = client('kemz_restore'); await restored.connect();
  const actualSchema = await schema(restored);
  const expectedSchema = await schema(expected);
  const differences = {};
  for (const key of Object.keys(actualSchema)) {
    const a = actualSchema[key].map(row => JSON.stringify(row));
    const b = expectedSchema[key].map(row => JSON.stringify(row));
    differences[key] = { actualOnly: a.filter(row => !b.includes(row)), expectedOnly: b.filter(row => !a.includes(row)) };
  }
  const matches = Object.values(differences).every(diff => !diff.actualOnly.length && !diff.expectedOnly.length);
  await fs.writeFile(path.join(root, 'schema-comparison.json'), JSON.stringify({ matches, differences }, null, 2));
  await log({ schemaMatches: matches, counts: Object.fromEntries(Object.entries(actualSchema).map(([key, rows]) => [key, rows.length])), localOnly: true });
  if (!matches) throw new Error('schema_diff_baseline_not_applied');
  await fs.writeFile(path.join(root, 'verified-schema.json'), JSON.stringify({
    schema: actualSchema, verifiedAt: new Date().toISOString(),
    migrations: await Promise.all(names.map(async name => ({ name, sha256: crypto.createHash('sha256')
      .update(await fs.readFile(path.join(app, 'src/migrations', `${name}.ts`))).digest('hex') }))),
  }));
  const before = await counts(restored);
  await restored.query('BEGIN');
  await restored.query('LOCK TABLE payload_migrations IN SHARE ROW EXCLUSIVE MODE');
  for (const name of names) await restored.query(`INSERT INTO payload_migrations(name,batch)
    SELECT $1::varchar,1 WHERE NOT EXISTS(SELECT 1 FROM payload_migrations WHERE name=$1::varchar)`, [name]);
  await restored.query(`DELETE FROM payload_migrations WHERE name='dev' AND batch=-1`);
  await restored.query('COMMIT');
  const after = await counts(restored);
  const unchanged = Object.entries(before).every(([table, n]) => table === 'payload_migrations' || after[table] === n);
  if (!unchanged || JSON.stringify(await schema(restored)) !== JSON.stringify(actualSchema)) throw new Error('baseline_changed_content_or_schema');
  const history = (await restored.query('SELECT name,batch FROM payload_migrations ORDER BY name')).rows;
  await log({ baselineClonePassed: true, history, contentCountsUnchanged: unchanged, schemaUnchanged: true, remoteChanges: false });
  if (process.argv.includes('--native')) {
    // Exercise the installed migrator's skip logic with real clone history and
    // a SELECT-only adapter, without initializing Payload or loading .env.
    const { migrate } = await import(pathToFileURL(path.join(app, 'node_modules/@payloadcms/drizzle/dist/migrate.js')).href);
    const adapter = { name: 'postgres', execute: ({ raw }) => restored.query(raw), payload: {
      logger: { info() {}, error() {} },
      find: async () => ({ docs: (await restored.query('SELECT name,batch FROM payload_migrations ORDER BY name DESC')).rows
        .map(row => ({ ...row, batch: Number(row.batch) })) }),
    } };
    await migrate.call(adapter, { migrations: names.map(name => ({ name,
      up: async () => { throw new Error('Existing initial/lead UP must never execute'); } })) });
    const finalCounts = await counts(restored);
    if (JSON.stringify(finalCounts) !== JSON.stringify(after) || JSON.stringify(await schema(restored)) !== JSON.stringify(actualSchema)) {
      throw new Error('native_migrate_changed_baselined_clone');
    }
    await log({ nativeMigratorSkipLogicPassed: true, existingVersionsSkipped: names,
      contentAndSchemaUnchanged: true, remoteChanges: false });
  }
} catch (error) {
  await log({ passed: false, error: error instanceof Error ? error.message : 'unknown', remoteChanges: false });
  process.exitCode = 1;
} finally {
  for (const client of [expected, restored, admin]) if (client) await client.end().catch(() => {});
  if (started) await tool('pg_ctl.exe', ['-D', data, '-w', '-m', 'fast', 'stop']);
}
