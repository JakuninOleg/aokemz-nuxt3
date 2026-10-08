import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getPayload } from 'payload';
import config from '../src/payload.config.ts';
const database = new URL(process.env.DATABASE_URL);
if (database.hostname !== 'a1b261b9619c2200fd8955fe.twc1.net' || database.pathname !== '/default_db') throw new Error('Wrong migration database');
const email = 'oleg.kemz@gmail.com';
const payload = await getPayload({ config });
const existing = await payload.find({ collection: 'users', depth: 0, limit: 1, where: { email: { equals: email } } });
if (existing.docs.length) {
  if (existing.docs[0].role !== 'administrator') throw new Error('Existing account has a different role; no automatic privilege changes');
  console.log('Administrator already exists; password unchanged.');
} else {
  const count = await payload.count({ collection: 'users' });
  if (count.totalDocs !== 0) throw new Error('Bootstrap only supports an empty users collection');
  const password = randomBytes(24).toString('base64url');
  // Persist recovery information before the write; private directory is excluded from Git.
  const directory = path.resolve('../../.migration-private');
  await mkdir(directory, { recursive: true });
  const filename = path.join(directory, 'oj-cms-admin.json');
  await writeFile(filename, JSON.stringify({ email, password, admin: 'http://127.0.0.1:3100/admin' }, null, 2), { flag: 'wx', mode: 0o600 });
  await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, role: 'administrator' } });
  console.log(JSON.stringify({ administratorCreated: true, credentialFile: filename }));
}
await payload.destroy();
setTimeout(() => process.exit(0), 200);
