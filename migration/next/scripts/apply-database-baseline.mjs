import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { databasePool } from '../src/lib/database-pool.ts';

// Explicit release action: migration history only. Never executes migration UP/DOWN.
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const privateRoot = path.resolve(app, '../../.migration-private');
const root = path.resolve(privateRoot, process.env.KEMZ_RELEASE_BACKUP_DIR || '');
const names = ['20261007_221720_initial', '20261008_105450_leads'];
if (path.dirname(root) !== privateRoot || !process.argv.includes('--apply-history-only')) {
  throw new Error('Explicit private backup directory and --apply-history-only required');
}
const verified = JSON.parse(await fs.readFile(path.join(root, 'verified-schema.json'), 'utf8'));
const backup = await fs.stat(path.join(root, 'kemz-staging.dump'));
if (backup.size < 1000 || Date.now() - backup.mtimeMs > 3600_000 || Date.now() - Date.parse(verified.verifiedAt) > 3600_000) {
  throw new Error('Fresh backup and verified restored schema required (within one hour)');
}
for (const name of names) {
  const hash = crypto.createHash('sha256').update(await fs.readFile(path.join(app, 'src/migrations', `${name}.ts`))).digest('hex');
  if (verified.migrations.find(row => row.name === name)?.sha256 !== hash) throw new Error('Migration changed since restore check');
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
const quote = value => `"${value.replaceAll('"', '""')}"`;
async function counts(client, tables) {
  const result = {};
  for (const table of tables) result[table] = (await client.query(`SELECT count(*)::int AS n FROM ${quote(table)}`)).rows[0].n;
  return result;
}
const client = new pg.Client({ ...databasePool(), connectionTimeoutMillis: 10_000 });
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query("SET LOCAL lock_timeout='5s'");
  await client.query("SET LOCAL statement_timeout='30s'");
  const tables = (await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).rows.map(row => row.tablename);
  // Short write freeze prevents count/schema races; no app/content tables are modified.
  await client.query(`LOCK TABLE ${tables.map(quote).join(',')} IN SHARE MODE`);
  await client.query('LOCK TABLE payload_migrations IN SHARE ROW EXCLUSIVE MODE');
  const beforeSchema = await schema(client);
  if (JSON.stringify(beforeSchema) !== JSON.stringify(verified.schema)) throw new Error('Remote schema differs from verified migrations');
  const before = await counts(client, tables);
  const historyBefore = (await client.query('SELECT name,batch FROM payload_migrations ORDER BY name')).rows;
  if (historyBefore.some(row => !names.includes(row.name) && !(row.name === 'dev' && Number(row.batch) === -1))) {
    throw new Error('Unexpected migration history; refusing baseline');
  }
  for (const name of names) await client.query(`INSERT INTO payload_migrations(name,batch)
    SELECT $1::varchar,1 WHERE NOT EXISTS(SELECT 1 FROM payload_migrations WHERE name=$1::varchar)`, [name]);
  await client.query("DELETE FROM payload_migrations WHERE name='dev' AND batch=-1");
  const history = (await client.query('SELECT name,batch FROM payload_migrations ORDER BY name')).rows;
  if (history.length !== names.length || history.some(row => Number(row.batch) !== 1)) throw new Error('Baseline history invalid');
  const after = await counts(client, tables);
  if (Object.keys(before).some(table => table !== 'payload_migrations' && before[table] !== after[table]) ||
      JSON.stringify(await schema(client)) !== JSON.stringify(beforeSchema)) throw new Error('Content or schema unexpectedly changed');
  await client.query('COMMIT');
  await fs.writeFile(path.join(root, 'remote-baseline-proof.json'), JSON.stringify({
    appliedAt: new Date().toISOString(), history, before, after, contentCountsUnchanged: true, schemaUnchanged: true,
    changes: 'payload_migrations history only', backupBytes: backup.size,
  }, null, 2));
  console.log(JSON.stringify({ baselineApplied: true, history, contentCountsUnchanged: true, schemaUnchanged: true }));
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  console.error(JSON.stringify({ baselineApplied: false, errorCode: error?.code || 'validation_failed',
    validation: error?.code ? undefined : error.message }));
  process.exitCode = 1;
} finally { await client.end(); }
