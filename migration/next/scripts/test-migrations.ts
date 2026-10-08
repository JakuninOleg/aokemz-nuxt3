/**
 * Generate (optional) and apply Payload versioned PostgreSQL migrations against a
 * fresh isolated embedded-postgres cluster. Never loads .env, never uses a remote
 * DATABASE_URL, and never contacts real S3/SMTP.
 *
 * Usage (from migration/next):
 *   node --import tsx scripts/test-migrations.ts --create
 *   node --import tsx scripts/test-migrations.ts --apply
 *
 * On Windows, PostgreSQL refuses to start under an elevated Administrator token.
 * If the shell is elevated, run --apply with a filtered token, e.g.:
 *   runas /trustlevel:0x20000 "cmd /c \"cd /d <migration/next> && node --import tsx scripts/test-migrations.ts --apply\""
 *
 * Never point this script at an existing remote/populated database. Initial
 * CREATE TABLE migrations are only safe on an empty cluster (this test) or a
 * brand-new empty database.
 */
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';
import payload, { getPayload, type Payload } from 'payload';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(scriptDir, '..');
const migrationsDir = path.resolve(appRoot, 'src/migrations');
const createOnly = process.argv.includes('--create');
const applyOnly = process.argv.includes('--apply');
const keepCluster = process.argv.includes('--keep');

/** Dummy S3 so s3Storage is enabled for schema (prefix / _objectKey) without external I/O. */
const DUMMY_S3 = {
  S3_BUCKET: 'kemz-migration-schema-dummy',
  S3_ENDPOINT: 'http://127.0.0.1:9',
  S3_REGION: 'eu-test-1',
  S3_ACCESS_KEY_ID: 'dummy-access-key',
  S3_SECRET_ACCESS_KEY: 'dummy-secret-key',
} as const;

function stripRemoteAndSideEffects() {
  // Never inherit a remote DB or real side-channel credentials for this test.
  const blocked = [
    'DATABASE_URL',
    'DATABASE_URI',
    'S3_BUCKET',
    'S3_ENDPOINT',
    'S3_REGION',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_PASSWORD',
  ];
  for (const key of blocked) delete process.env[key];
}

function installDummyS3() {
  for (const [key, value] of Object.entries(DUMMY_S3)) {
    process.env[key] = value;
  }
}

async function freePort(): Promise<number> {
  const server = net.createServer();
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as net.AddressInfo).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  return port;
}

async function clearMigrationArtifacts() {
  if (!existsSync(migrationsDir)) {
    await mkdir(migrationsDir, { recursive: true });
    return;
  }
  for (const file of readdirSync(migrationsDir)) {
    if (file === 'index.ts' || file.endsWith('.ts') || file.endsWith('.json')) {
      await rm(path.join(migrationsDir, file), { force: true });
    }
  }
}

async function createInitialMigration() {
  process.env.PAYLOAD_SECRET = process.env.PAYLOAD_SECRET || randomBytes(32).toString('hex');
  process.env.PAYLOAD_MIGRATING = 'true';
  // Placeholder only — createMigration runs with disableDBConnect.
  process.env.DATABASE_URL = 'postgresql://kemz:unused@127.0.0.1:1/kemz_migration_unused';
  delete process.env.NODE_ENV;
  installDummyS3();

  // Full initial for fresh DBs: empty snapshot before generate (not a delta on S3-less SQL).
  await clearMigrationArtifacts();

  const config = (await import('../src/payload.config')).default;
  await payload.init({
    config,
    disableDBConnect: true,
    disableOnInit: true,
  });

  assert.equal(payload.db.migrationDir, migrationsDir);

  const media = payload.collections.media;
  const fieldNames = new Set(
    (media?.config.fields || [])
      .map((field) => ('name' in field ? field.name : undefined))
      .filter((name): name is string => typeof name === 'string'),
  );
  assert.equal(
    fieldNames.has('prefix'),
    true,
    's3Storage must inject media.prefix (dummy S3_BUCKET required during create)',
  );
  assert.equal(
    fieldNames.has('_objectKey'),
    true,
    's3Storage must inject media._objectKey',
  );

  await payload.db.createMigration({
    forceAcceptWarning: true,
    migrationName: 'initial',
    payload,
    skipEmpty: false,
  });

  await payload.destroy();

  const artifacts = readdirSync(migrationsDir);
  const initialTs = artifacts.find(
    (file) => file.endsWith('.ts') && file.includes('initial') && file !== 'index.ts',
  );
  assert.ok(initialTs, 'expected regenerated *_initial.ts');
  const sql = await import('node:fs/promises').then((fs) =>
    fs.readFile(path.join(migrationsDir, initialTs), 'utf8'),
  );
  assert.match(sql, /"prefix"/, 'initial UP SQL must include media.prefix');
  // Drizzle lowercases Payload field `_objectKey` → column `_objectkey`.
  assert.match(sql, /"_objectkey"/, 'initial UP SQL must include media._objectkey');

  console.log(
    JSON.stringify(
      {
        created: true,
        migrationsDir,
        initialMigration: initialTs,
        storageFields: ['prefix', '_objectKey'],
        dummyS3Enabled: true,
        externalCalls: false,
      },
      null,
      2,
    ),
  );
}

async function applyAndVerify() {
  const port = await freePort();
  const databaseDir = path.resolve(
    appRoot,
    '../../.migration-private/postgres',
    `migrations-test-${Date.now()}`,
  );
  await mkdir(databaseDir, { recursive: true });
  const password = randomBytes(24).toString('hex');
  process.env.PAYLOAD_SECRET = randomBytes(32).toString('hex');
  process.env.DATABASE_URL = `postgresql://kemz:${password}@127.0.0.1:${port}/kemz_migration`;
  process.env.NODE_ENV = 'production';
  process.env.PAYLOAD_MIGRATING = 'true';
  installDummyS3();

  const pg = new EmbeddedPostgres({
    databaseDir,
    user: 'kemz',
    password,
    port,
    persistent: true,
    authMethod: 'scram-sha-256',
    createPostgresUser: false,
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
    postgresFlags: ['-h', '127.0.0.1'],
    onLog: (message) => console.log(String(message).trim()),
    onError: (error) => console.error(String(error)),
  });

  let cms: Payload | undefined;
  let shuttingDown = false;
  let failed = false;
  const markFailed = () => {
    failed = true;
    process.exitCode = 1;
  };

  const onLatePoolError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    if (
      shuttingDown &&
      /Connection terminated|ECONNRESET|Cannot use a pool after calling end/i.test(message)
    ) {
      return;
    }
    console.error(error);
    markFailed();
    if (!shuttingDown) process.exit(1);
  };
  process.on('uncaughtException', onLatePoolError);
  process.on('unhandledRejection', onLatePoolError);

  const watchdog = setTimeout(() => {
    console.error('Migration test timed out');
    markFailed();
  }, 180000);

  try {
    console.log('Initialising isolated PostgreSQL for migrations');
    await pg.initialise();
    console.log('Starting isolated PostgreSQL');
    await pg.start();
    console.log('Creating empty test database');
    const client = pg.getPgClient('postgres', '127.0.0.1');
    await client.connect();
    await client.query('CREATE DATABASE kemz_migration');
    await client.end();

    const config = (await import('../src/payload.config')).default;
    // Production + no prodMigrations on config => push disabled; we migrate explicitly.
    cms = await getPayload({ config, key: `migrations-test-${port}` });
    assert.equal(cms.db.migrationDir, migrationsDir);
    assert.notEqual(cms.db.push, true);

    const mediaFields = new Set(
      (cms.collections.media?.config.fields || [])
        .map((field) => ('name' in field ? field.name : undefined))
        .filter((name): name is string => typeof name === 'string'),
    );
    assert.equal(mediaFields.has('prefix'), true, 'apply runtime must load s3Storage fields');
    assert.equal(mediaFields.has('_objectKey'), true, 'apply runtime must load _objectKey');

    console.log('Running versioned migrations (push disabled)');
    await cms.db.migrate();
    delete process.env.PAYLOAD_MIGRATING;

    const pool =
      cms.db && 'pool' in cms.db
        ? (cms.db as { pool?: { query: (sql: string) => Promise<{ rows: Array<Record<string, string>> }> } })
            .pool
        : undefined;
    assert.ok(pool?.query, 'expected postgres pool for column verification');
    const columnResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'media'
        AND column_name IN ('prefix', '_objectkey')
      ORDER BY column_name
    `);
    const mediaColumns = columnResult.rows.map((row) => row.column_name);
    assert.deepEqual(
      mediaColumns,
      ['_objectkey', 'prefix'],
      'migrated media table must include storage plugin columns',
    );

    const collections = [
      'users',
      'media',
      'categories',
      'products',
      'news',
      'documents',
      'payload-migrations',
    ] as const;

    const counts: Record<string, number> = {};
    for (const slug of collections) {
      const result = await cms.find({
        collection: slug,
        limit: 1,
        overrideAccess: true,
      });
      counts[slug] = result.totalDocs;
    }

    assert.equal(counts['payload-migrations'] >= 1, true, 'expected at least one applied migration row');
    assert.equal(counts.users, 0);
    assert.equal(counts.media, 0);
    assert.equal(counts.categories, 0);
    assert.equal(counts.products, 0);
    assert.equal(counts.news, 0);
    assert.equal(counts.documents, 0);

    const applied = await cms.find({
      collection: 'payload-migrations',
      limit: 50,
      overrideAccess: true,
      sort: 'name',
    });
    assert.ok(
      applied.docs.some((row) => typeof row.name === 'string' && row.name.includes('initial')),
      'initial migration name missing from payload-migrations',
    );
    assert.ok(
      applied.docs.every((row) => row.batch !== -1),
      'dev schema-push marker (batch -1) must not appear after production migrate',
    );

    // Write/read smoke on the migrated schema (not via push). No media upload => no S3 I/O.
    const administrator = await cms.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email: 'migration-admin@example.test',
        password: randomBytes(24).toString('hex'),
        role: 'administrator',
      },
    });
    assert.ok(administrator.id);

    const category = await cms.create({
      collection: 'categories',
      overrideAccess: true,
      data: {
        title: 'Миграционная проверка',
        slug: 'migration-check',
        _status: 'published',
      },
    });
    const products = await cms.find({
      collection: 'products',
      overrideAccess: true,
      limit: 1,
    });
    assert.equal(products.totalDocs, 0);
    assert.ok(category.id);

    console.log(
      JSON.stringify(
        {
          passed: true,
          mode: 'production',
          pushDisabled: cms.db.push !== true,
          databaseHost: '127.0.0.1',
          migrationsDir,
          mediaStorageColumns: mediaColumns,
          appliedMigrations: applied.docs.map((row) => ({ name: row.name, batch: row.batch })),
          collectionCountsAfterMigrate: counts,
          checks: [
            'isolated embedded-postgres',
            'no .env load',
            'no remote DATABASE_URL',
            'dummy S3 env only (no external S3/SMTP calls)',
            'NODE_ENV=production (push disabled)',
            'versioned migrate applied',
            'media.prefix and media._objectkey present',
            'collection queries succeeded',
            'create against migrated schema succeeded',
          ],
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.stack || error.message : error);
    markFailed();
  } finally {
    clearTimeout(watchdog);
    shuttingDown = true;
    const failureBeforeStop = failed || process.exitCode === 1;
    try {
      // Payload drizzle destroy clears schema maps but does not always end the pg pool.
      const pool =
        cms?.db && 'pool' in cms.db
          ? (cms.db as { pool?: { end?: () => Promise<void> } }).pool
          : undefined;
      if (cms) await cms.destroy();
      if (pool?.end) await pool.end();
    } catch (destroyError) {
      if (!/Connection terminated|ECONNRESET|pool after calling end/i.test(String(destroyError))) {
        console.error(destroyError instanceof Error ? destroyError.message : destroyError);
        markFailed();
      }
    }
    try {
      await pg.stop();
    } catch (stopError) {
      console.error(stopError instanceof Error ? stopError.message : stopError);
      markFailed();
    }
    // pg.stop must not clear a prior test failure.
    if (failureBeforeStop) {
      process.exitCode = 1;
    }
    if (!keepCluster) {
      // Windows may keep locks briefly after pg_ctl stop.
      for (let attempt = 0; attempt < 8; attempt++) {
        try {
          await rm(databaseDir, { recursive: true, force: true });
          break;
        } catch (cleanupError) {
          const code =
            cleanupError && typeof cleanupError === 'object' && 'code' in cleanupError
              ? String((cleanupError as { code?: string }).code)
              : '';
          if (attempt === 7 || (code !== 'EBUSY' && code !== 'EPERM')) {
            console.error(
              cleanupError instanceof Error ? cleanupError.message : cleanupError,
            );
            // Do not fail a successful migrate/query run solely on temp-dir cleanup.
            if (!failureBeforeStop && process.exitCode !== 1) {
              console.error(
                'Temporary cluster cleanup deferred; directory may remain under .migration-private/postgres',
              );
            }
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }
    process.off('uncaughtException', onLatePoolError);
    process.off('unhandledRejection', onLatePoolError);
    if (failureBeforeStop) process.exitCode = 1;
  }
}

stripRemoteAndSideEffects();

try {
  if (createOnly) {
    await createInitialMigration();
  } else if (applyOnly) {
    await applyAndVerify();
  } else {
    // Default: regenerate initial with storage schema, then apply on a fresh local cluster.
    await createInitialMigration();
    stripRemoteAndSideEffects();
    await applyAndVerify();
  }
} catch (error) {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
}

process.exit(process.exitCode ?? 0);
