import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const origin = 'http://127.0.0.1:3100';
const credentials = JSON.parse(await readFile('../../.migration-private/oj-cms-admin.json', 'utf8'));
async function call(route, method = 'GET', body, token) {
  return fetch(`${origin}/api/${route}`, { method, headers: { 'content-type': 'application/json', ...(token ? { authorization: `JWT ${token}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
const auth = await call('users/login', 'POST', credentials);
assert.equal(auth.status, 200);
const { token: administrator } = await auth.json();
const password = randomBytes(24).toString('base64url');
const email = `migration-check-${Date.now()}@example.invalid`;
let editorID;
let categoryID;
try {
  const created = await call('users', 'POST', { email, password, role: 'editor' }, administrator);
  assert.equal(created.status, 201);
  editorID = (await created.json()).doc.id;
  const login = await call('users/login', 'POST', { email, password });
  assert.equal(login.status, 200);
  const { token: editor } = await login.json();
  const forbidden = await call('users', 'POST', { email: `forbidden-${email}`, password, role: 'administrator' }, editor);
  assert.equal(forbidden.status, 403);
  const escalated = await call(`users/${editorID}`, 'PATCH', { role: 'administrator' }, editor);
  assert.equal(escalated.status, 200);
  assert.equal((await escalated.json()).doc.role, 'editor');
  const createdDraft = await call('categories', 'POST', { title: `Проверка миграции ${Date.now()}`, visible: false, _status: 'draft' }, editor);
  assert.equal(createdDraft.status, 201);
  const draft = (await createdDraft.json()).doc;
  categoryID = draft.id;
  assert.match(draft.slug, /^proverka-migratsii-/);
  assert.equal((await call(`categories/${categoryID}`)).status, 404);
  assert.equal((await fetch(`${origin}/products/${draft.slug}`)).status, 404);
  const forbiddenDelete = await call(`categories/${categoryID}`, 'DELETE', undefined, editor);
  assert.equal(forbiddenDelete.status, 403);
  const published = await call(`categories/${categoryID}`, 'PATCH', { _status: 'published' }, editor);
  assert.equal(published.status, 200);
  assert.equal((await call(`categories/${categoryID}`)).status, 200);
  assert.equal((await fetch(`${origin}/products/${draft.slug}`)).status, 200);
  const backToDraft = await call(`categories/${categoryID}`, 'PATCH', { _status: 'draft' }, editor);
  assert.equal(backToDraft.status, 200);
  assert.equal((await fetch(`${origin}/products/${draft.slug}`)).status, 404);
  console.log(JSON.stringify({ editorLogin: true, userCreationDenied: true, privilegeEscalationPrevented: true,
    generatedRussianSlug: true, draftHiddenFromAnonymousAPIAndPage: true, publicationVisible: true, unpublicationImmediate: true, editorDeleteDenied: true }));
} finally {
  if (categoryID) assert.equal((await call(`categories/${categoryID}`, 'DELETE', undefined, administrator)).status, 200);
  if (editorID) assert.equal((await call(`users/${editorID}`, 'DELETE', undefined, administrator)).status, 200);
  console.log('Temporary workflow records removed.');
}
