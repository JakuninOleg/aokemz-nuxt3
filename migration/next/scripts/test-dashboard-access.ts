import assert from 'node:assert/strict';
import type { Access, PayloadRequest, SanitizedPermissions } from 'payload';
import { Leads } from '../src/collections/Leads';
import { administrators, administratorsField } from '../src/access';
import { readableDashboardCollections } from '../src/lib/dashboard-access';
import { analyticsEndpoint } from '../src/lib/metrika';

const request = (role?: string) => ({ user: role ? { id: 1, role } : null }) as unknown as PayloadRequest;
const permission = (access: Access | undefined, role?: string) => access!({ req: request(role) });
for (const role of ['administrator', 'editor']) {
  assert.equal(await permission(Leads.access?.read, role), true);
  assert.equal(Leads.access?.admin?.({ req: request(role) }), true);
}
assert.equal(await permission(Leads.access?.read), false);
assert.equal(Leads.access?.admin?.({ req: request() }), false);
assert.equal(await permission(Leads.access?.create, 'editor'), false);
assert.equal(await permission(Leads.access?.update, 'editor'), false);
assert.equal(await permission(Leads.access?.delete, 'editor'), false);
assert.equal(administrators({ req: request('editor') }), false, 'Editor cannot delete users');
assert.equal(administratorsField({ req: request('editor') }), false, 'Editor cannot change roles');
assert.equal(await permission(Leads.access?.update, 'administrator'), true);

const permissions = { collections: { products: { read: true }, leads: { read: true }, users: {} } } as SanitizedPermissions;
assert.deepEqual([...readableDashboardCollections(['products', 'leads', 'users'], permissions)], ['products', 'leads']);
assert.deepEqual([...readableDashboardCollections(['products'], undefined)], []);
const deniedLeads = { collections: { products: { read: true }, leads: {} } } as SanitizedPermissions;
assert.deepEqual([...readableDashboardCollections(['products', 'leads'], deniedLeads)], ['products'], 'No query of visible but forbidden collection');
console.log('PASS: editor lead viewing, protected users/roles, permission-filtered dashboard');

for (const role of ['administrator', 'editor']) {
  const req = { ...request(role), url: 'https://aokemz.ru/api/analytics?days=1' } as PayloadRequest;
  const response = await analyticsEndpoint.handler(req);
  assert.equal(response.status, 400, `${role} passes analytics authorization; invalid period avoids upstream call`);
}
for (const role of [undefined, 'unknown']) {
  const req = { ...request(role), url: 'https://aokemz.ru/api/analytics?days=1' } as PayloadRequest;
  const response = await analyticsEndpoint.handler(req);
  assert.equal(response.status, 403, 'Analytics unavailable without an editor or administrator role');
}
console.log('PASS: editor and administrator analytics access, anonymous analytics denied');
