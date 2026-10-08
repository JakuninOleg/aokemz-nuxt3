import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { getPayload, createLocalReq } from 'payload';
import config from '../src/payload.config';
import { up } from '../src/migrations/20261008_105450_leads';
import { createLeadStore } from '../src/lib/lead-store';
import { handleLead } from '../src/lib/lead-handler';

assert.equal(process.env.KEMZ_ALLOW_LEAD_SMOKE, '1');
assert.equal(new URL(process.env.DATABASE_URL!).hostname, 'a1b261b9619c2200fd8955fe.twc1.net');
const cms = await getPayload({ config });
const ids = new Set<number>();
try {
  // This existing preview DB was populated using schema push, not the initial migration.
  // Apply ONLY the reviewed additive migration. Never rerun initial CREATE TABLE statements.
  const exists = await cms.db.pool.query("SELECT to_regclass('public.leads') AS leads");
  if (!exists.rows[0].leads) {
    const { PgDialect } = await import('drizzle-orm/pg-core');
    const client = await cms.db.pool.connect();
    try {
      await client.query('BEGIN');
      await up({ db: { execute: async statement => { const query = new PgDialect().sqlToQuery(statement); return client.query(query.sql, query.params); } } as Parameters<typeof up>[0]['db'], payload: cms, req: await createLocalReq({}, cms) });
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
    console.log('Additive leads migration applied to the preview DB; existing content retained.');
  }
  const store = createLeadStore(cms);
  const before = (await cms.count({ collection: 'leads', overrideAccess: true })).totalDocs;
  const input = { name: 'Проверка сохранения', email: 'lead-smoke@example.test', phone: '79991234567', message: 'Тест сохранения заявки без отправки реальных писем', consent: true as const, sourcePath: '/contacts', requestId: randomUUID() };
  let delivered = 0;
  const request = () => new Request('http://127.0.0.1:3100/api/sendMail', { method: 'POST', headers: { origin: 'http://127.0.0.1:3100', 'content-type': 'application/json' }, body: JSON.stringify(input) });
  assert.equal((await handleLead(request(), async () => { delivered++; }, 'storage-smoke', store)).status, 200);
  const created = await cms.find({ collection: 'leads', overrideAccess: true, where: { requestId: { equals: input.requestId } } });
  ids.add(created.docs[0].id);
  assert.equal(created.docs[0].mailStatus, 'sent');
  assert.equal(created.docs[0].phone, input.phone);
  assert.equal((await handleLead(request(), async () => { delivered++; }, 'storage-smoke', store)).status, 200);
  assert.equal(delivered, 1);
  assert.equal((await cms.count({ collection: 'leads', overrideAccess: true })).totalDocs, before + 1);
  const concurrentInput = { ...input, requestId: randomUUID() };
  const concurrent = await Promise.all([store.reserve(concurrentInput), store.reserve(concurrentInput)]);
  concurrent.forEach(result => ids.add(result.id));
  assert.equal(concurrent[0].id, concurrent[1].id);
  assert.equal(concurrent.filter(result => result.created).length, 1);
  await assert.rejects(store.reserve({ ...concurrentInput, message: 'Other content' }));
  await store.finish(concurrent[0].id, 'failed');
  assert.equal((await cms.findByID({ collection: 'leads', id: concurrent[0].id, overrideAccess: true })).mailStatus, 'failed');
  const admin = (await cms.find({ collection: 'users', overrideAccess: true, where: { role: { equals: 'administrator' } }, limit: 1 })).docs[0];
  assert.ok(admin);
  const adminReq = await createLocalReq({ user: { ...admin, collection: 'users' } }, cms);
  const editorReq = await createLocalReq({ user: { ...admin, role: 'editor', collection: 'users' } }, cms);
  await assert.rejects(cms.find({ collection: 'leads', overrideAccess: false }), { status: 403 });
  await assert.rejects(cms.find({ collection: 'leads', overrideAccess: false, req: editorReq }), { status: 403 });
  assert.equal((await cms.find({ collection: 'leads', overrideAccess: false, req: adminReq })).totalDocs, before + ids.size);
  await assert.rejects(cms.create({ collection: 'leads', data: created.docs[0], overrideAccess: false, req: adminReq }));
  const updated = await cms.update({ collection: 'leads', id: created.docs[0].id, overrideAccess: false, req: adminReq, data: { status: 'in_progress', notes: 'Тест заметки', message: 'Попытка подмены' } });
  assert.equal(updated.status, 'in_progress');
  assert.equal(updated.message, input.message);
  console.log('DB storage, concurrent deduplication, immutable contact fields and administrator-only access verified. No real mail sent.');
} finally {
  for (const id of ids) await cms.delete({ collection: 'leads', id, overrideAccess: true });
  await cms.destroy();
}
process.exit(0);
