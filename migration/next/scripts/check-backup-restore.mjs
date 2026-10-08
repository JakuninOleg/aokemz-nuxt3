import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import EmbeddedPostgres from 'embedded-postgres';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(app, '../../.migration-private/release-restore-20261008');
const binaries = path.join(app, 'node_modules/@embedded-postgres/windows-x64/native/bin');
const dumpFile = path.join(root, 'kemz-staging.dump');
const dumpTool = process.env.PG_DUMP_BIN || path.join(binaries, 'pg_dump.exe');
const restoreTool = process.env.PG_RESTORE_BIN || path.join(binaries, 'pg_restore.exe');
const tables = ['users', 'media', 'categories', 'products', 'news', 'documents', 'leads', 'payload_migrations'];
const mode = process.argv[2];
if (!['dump', 'restore'].includes(mode)) throw new Error('Choose dump or restore');
await fs.mkdir(root, { recursive: true });
const log = async value => fs.appendFile(path.join(root, `${mode}.log`), `${JSON.stringify(value)}\n`);
function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env, windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    // Never print stderr: database tools may contain identifying details.
    child.stderr.resume();
    const timer = setTimeout(() => child.kill(), 120_000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error(`tool_exit_${code}`)); });
  });
}
async function counts(client) {
  const result = {};
  for (const table of tables) result[table] = (await client.query(`SELECT count(*)::int AS n FROM "${table}"`)).rows[0].n;
  return result;
}
if (mode === 'dump') {
  try { await fs.access(dumpTool); } catch {
    console.error('Backup not created: pg_dump is unavailable. Configure PG_DUMP_BIN with a compatible PostgreSQL client.');
    process.exit(1);
  }
  try { await fs.access(dumpFile); throw new Error('Private backup already exists; do not overwrite it'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const u = new URL(process.env.DATABASE_URL);
  const cert = process.env.DATABASE_CA_CERT;
  let caPath = u.searchParams.get('sslrootcert');
  if (cert) {
    caPath = path.join(root, 'ca.crt');
    await fs.writeFile(caPath, cert.replace(/\\n/g, '\n'));
  }
  if (!caPath) throw new Error('Verified TLS certificate required');
  const ca = await fs.readFile(caPath, 'utf8');
  const client = new pg.Client({ host: u.hostname, port: Number(u.port || 5432), database: decodeURIComponent(u.pathname.slice(1)),
    user: decodeURIComponent(u.username), password: decodeURIComponent(u.password), ssl: { ca, rejectUnauthorized: true } });
  try {
    await client.connect();
    await client.query('BEGIN READ ONLY');
    const expected = await counts(client);
    const version = (await client.query('SHOW server_version')).rows[0].server_version;
    await client.query('ROLLBACK');
    await run(dumpTool, ['--format=custom', '--no-owner', '--no-acl', '--file', dumpFile,
      '--host', u.hostname, '--port', u.port || '5432', '--username', decodeURIComponent(u.username), decodeURIComponent(u.pathname.slice(1))],
    { ...process.env, PGPASSWORD: decodeURIComponent(u.password), PGSSLMODE: 'verify-full', PGSSLROOTCERT: caPath });
    await fs.writeFile(path.join(root, 'expected.json'), JSON.stringify({ expected, version }));
    await log({ dumpCreated: true, bytes: (await fs.stat(dumpFile)).size, remoteReadOnly: true, version, expected });
    console.log('Private logical backup created; credentials and data not printed. Restore not yet verified.');
  } finally { await client.end(); }
} else {
  try { await fs.access(restoreTool); } catch {
    console.error('Restore not run: pg_restore is unavailable. Configure PG_RESTORE_BIN.');
    process.exit(1);
  }
  try { await fs.access(path.join(root, 'postgres')); throw new Error('Restore cluster already exists; use a fresh private root'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  // Does not load .env or use any remote DB, SMTP or S3.
  const expected = JSON.parse(await fs.readFile(path.join(root, 'expected.json'), 'utf8'));
  const reservation = net.createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const password = crypto.randomBytes(24).toString('hex');
  const cluster = new EmbeddedPostgres({ databaseDir: path.join(root, 'postgres'), user: 'restore_user', password, port,
    persistent: true, authMethod: 'scram-sha-256', createPostgresUser: false,
    initdbFlags: ['--encoding=UTF8', '--locale=C'], postgresFlags: ['-h', '127.0.0.1'],
    onLog() {}, onError() {} });
  let client;
  let started = false;
  try {
    await log({ stage: 'init', target: 'isolated localhost' });
    await cluster.initialise();
    await cluster.start(); started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'restore_user', password, database: 'postgres' });
    await client.connect();
    await client.query('CREATE DATABASE kemz_restore'); await client.end();
    await run(restoreTool, ['--exit-on-error', '--no-owner', '--no-acl', '--host', '127.0.0.1',
      '--port', String(port), '--username', 'restore_user', '--dbname', 'kemz_restore', dumpFile],
    { ...process.env, PGPASSWORD: password, PGSSLMODE: 'disable' });
    client = new pg.Client({ host: '127.0.0.1', port, user: 'restore_user', password, database: 'kemz_restore' });
    await client.connect();
    const actual = await counts(client);
    if (JSON.stringify(actual) !== JSON.stringify(expected.expected)) throw new Error('row_counts_mismatch');
    const constraints = (await client.query(`SELECT count(*)::int AS n FROM pg_constraint
      WHERE contype = 'f' AND connamespace = 'public'::regnamespace AND convalidated`)).rows[0].n;
    await log({ restorePassed: true, actual, validatedForeignKeys: constraints, localOnly: true, remoteDDL: false });
    console.log('Isolated database restore and row counts PASS. No remote writes.');
  } catch (error) {
    await log({ restorePassed: false, error: error instanceof Error ? error.message : 'unknown' });
    process.exitCode = 1;
  } finally {
    if (client) await client.end().catch(() => {});
    if (started) await cluster.stop();
  }
}
