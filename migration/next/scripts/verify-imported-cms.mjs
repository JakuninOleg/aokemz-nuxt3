import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getPayload } from 'payload';
import config from '../src/payload.config.ts';
import { getEnabledNodes } from '@payloadcms/richtext-lexical';
import { createHeadlessEditor } from '@payloadcms/richtext-lexical/lexical/headless';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getStorageFilePath } from '@payloadcms/plugin-cloud-storage/utilities';
const target = new URL(process.env.DATABASE_URL);
if (target.hostname !== 'a1b261b9619c2200fd8955fe.twc1.net' || target.pathname !== '/default_db') throw new Error('Wrong migration target');
const payload = await getPayload({ config });
const client = new S3Client({ endpoint: process.env.S3_ENDPOINT, region: process.env.S3_REGION,
  credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } });
const directory = path.resolve('../../.migration-private/media-check');
let parsedFields = 0;
let tables = 0;
try {
  for (const collection of ['products', 'news']) {
    const records = await payload.find({ collection, depth: 0, limit: 100, overrideAccess: true });
    const publicRecords = await payload.find({ collection, depth: 0, limit: 100, overrideAccess: false });
    assert.equal(publicRecords.totalDocs, records.totalDocs);
    for (const doc of publicRecords.docs) { assert.equal(doc._status, 'published'); assert.equal(doc.sourceRecord, undefined); }
    const configured = payload.config.collections.find(item => item.slug === collection);
    for (const doc of records.docs) {
      for (const fieldName of collection === 'products' ? ['description', 'specifications'] : ['body']) {
        if (!doc[fieldName]) continue;
        const field = configured.fields.find(item => item.name === fieldName);
        const editor = createHeadlessEditor({ nodes: getEnabledNodes({ editorConfig: field.editor.editorConfig }),
          onError: error => { throw error; } });
        const state = editor.parseEditorState(doc[fieldName]);
        assert.ok(state.toJSON().root.children.length > 0);
        const html = convertLexicalToHTML({ data: doc[fieldName] });
        assert.ok(html.length > 0);
        if (html.includes('<table')) tables++;
        parsedFields++;
      }
    }
  }
  await assert.rejects(() => payload.find({ collection: 'users', overrideAccess: false }));
  const files = await payload.find({ collection: 'media', depth: 0, limit: 100, overrideAccess: true });
  await mkdir(directory, { recursive: true });
  const samples = ['image/jpeg', 'image/png'].map(type => files.docs.filter(doc => doc.mimeType === type).sort((a, b) => b.filesize - a.filesize)[0]);
  for (const [index, doc] of samples.entries()) {
    for (const [name, filename] of [['original', doc.filename], ['webp', doc.sizes.content.filename]]) {
      const key = await getStorageFilePath({ doc, filename, collectionPrefix: 'kemz/media' });
      const response = await client.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
      await writeFile(path.join(directory, `${index}-${name}${path.extname(filename)}`), Buffer.from(await response.Body.transformToByteArray()));
    }
  }
  console.log(JSON.stringify({ verified: true, parsedRichTextFields: parsedFields, renderedTables: tables,
    publicContentVisible: true, sourceMetadataPrivate: true, anonymousUsersDenied: true, sampleDirectory: directory }));
} finally {
  client.destroy(); await payload.destroy();
}
process.exit(0);
