import pg from 'pg';
import { databasePool } from '../src/lib/database-pool';

// SELECT-only check. Does not initialize Payload or run schema push/migrations.
const client = new pg.Client({ ...databasePool(), connectionTimeoutMillis: 10_000 });
try {
  await client.connect();
  await client.query('BEGIN READ ONLY');
  const history = await client.query('SELECT name, batch FROM payload_migrations ORDER BY id');
  const storage = await client.query(`SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'media'
      AND column_name IN ('prefix', '_objectkey') ORDER BY column_name`);
  const tables = await client.query(`SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name IN ('leads', 'users', 'products', 'news') ORDER BY table_name`);
  console.log(JSON.stringify({ readOnly: true, migrationHistory: history.rows,
    storageColumns: storage.rows.map(row => row.column_name),
    requiredTables: tables.rows.map(row => row.table_name),
    schemaPushMarkerPresent: history.rows.some(row => Number(row.batch) === -1) }));
  await client.query('ROLLBACK');
} catch (error) {
  // Drivers can include connection details in messages; print only safe code.
  console.error(JSON.stringify({ passed: false, readOnly: true,
    errorCode: typeof error === 'object' && error && 'code' in error ? error.code : 'unknown' }));
  process.exitCode = 1;
} finally {
  await client.end();
}
