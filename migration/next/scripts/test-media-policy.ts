import assert from 'node:assert/strict';
import sharp from 'sharp';
import type { PayloadRequest } from 'payload';
import { validatePhoto, validateUploadFile, validateMediaBeforeOperation, validateMediaUpload } from '../src/hooks/media';
import { MAX_DOCUMENT_BYTES, MAX_PHOTO_BYTES, MEDIA_IMAGE_WIDTHS, isUsableImageVariant } from '../src/lib/media-policy';

const png = await sharp({ create: { width: 64, height: 48, channels: 3, background: '#1760a0' } }).png().toBuffer();
const jpg = await sharp(png).jpeg().toBuffer();
const webp = await sharp(png).webp().toBuffer();
for (const [name, mimetype, data] of [['photo.png', 'image/png', png], ['photo.jpg', 'image/jpeg', jpg], ['photo.webp', 'image/webp', webp]] as const) {
  await validateUploadFile({ name, mimetype, data, size: data.length });
}
await assert.rejects(validateUploadFile({ name: 'large.jpg', mimetype: 'image/jpeg', data: jpg, size: MAX_PHOTO_BYTES + 1 }), /10 МБ/);
await assert.rejects(validateUploadFile({ name: 'hidden-large.jpg', mimetype: 'image/jpeg', data: Buffer.alloc(MAX_PHOTO_BYTES + 1), size: 1 }), /10 МБ/);
await assert.rejects(validateUploadFile({ name: 'large.pdf', mimetype: 'application/pdf', data: Buffer.from('%PDF-1.7'), size: MAX_DOCUMENT_BYTES + 1 }), /20 МБ/);
await assert.rejects(validateUploadFile({ name: 'evil.png', mimetype: 'image/png', data: Buffer.from('<svg/>'), size: 6 }), /SVG/);
await assert.rejects(validateUploadFile({ name: 'truncated.png', mimetype: 'image/png', data: png.subarray(0, Math.floor(png.length / 2)), size: png.length }), /повреждён/);
const tooWide = await sharp({ create: { width: 10001, height: 1, channels: 3, background: '#fff' } }).png().toBuffer();
assert.match((await validatePhoto(tooWide))!, /безопасной обработки/);
const tooManyPixels = await sharp({ create: { width: 7000, height: 6000, channels: 3, background: '#fff' } }).png().toBuffer();
assert.match((await validatePhoto(tooManyPixels))!, /безопасной обработки/);
// APNG animation-control chunk (Sharp may otherwise decode only its first frame).
const animationChunk = Buffer.alloc(20);
animationChunk.writeUInt32BE(8, 0);
animationChunk.write('acTL', 4, 'ascii');
animationChunk.writeUInt32BE(2, 8);
assert.match((await validatePhoto(Buffer.concat([png.subarray(0, 33), animationChunk, png.subarray(33)])))!, /Анимированные/);

await assert.rejects(validateMediaBeforeOperation({ operation: 'create', args: {}, req: { file: { name: 'x.jpg', mimetype: 'image/jpeg', data: jpg, size: MAX_PHOTO_BYTES + 1 } } } as Parameters<typeof validateMediaBeforeOperation>[0]), /10 МБ/);
await assert.rejects(validateMediaBeforeOperation({ operation: 'create', args: { data: { url: 'https://example.test/photo.png' } }, req: {} } as Parameters<typeof validateMediaBeforeOperation>[0]), /внешней ссылке/);
await validateMediaBeforeOperation({ operation: 'update', args: { data: { url: 'https://example.test/photo.png' } }, req: { context: { skipCloudStorage: true } } } as Parameters<typeof validateMediaBeforeOperation>[0]);

const sizes: Record<string, { filename: string; mimeType: string; width: number; height: number; filesize: number }> = {};
const buffers: Record<string, Buffer> = {};
for (const [name, width] of Object.entries(MEDIA_IMAGE_WIDTHS)) {
  const { data, info } = await sharp(png).resize({ width, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
  sizes[name] = { filename: `tiny-${name}.webp`, mimeType: 'image/webp', width: info.width, height: info.height, filesize: data.length };
  buffers[name] = data;
  assert.equal(isUsableImageVariant(sizes[name]), true);
}
const checkOutput = (outputSizes: typeof sizes, outputBuffers?: typeof buffers) => validateMediaUpload({
  data: { sizes: outputSizes }, req: { file: { mimetype: 'image/png' }, payloadUploadSizes: outputBuffers } as PayloadRequest,
} as Parameters<typeof validateMediaUpload>[0]);
await checkOutput(sizes, buffers);
await assert.rejects(checkOutput(sizes), /WebP/);
await assert.rejects(checkOutput({ ...sizes, content: { ...sizes.content!, filename: '' } }, buffers), /WebP/);
await assert.rejects(checkOutput(sizes, { ...buffers, content: jpg }), /WebP/);
await assert.rejects(checkOutput({ ...sizes, content: { ...sizes.content!, height: 99 } }, buffers), /Проверка/);
await validateMediaUpload({ req: {} as PayloadRequest } as Parameters<typeof validateMediaUpload>[0]);
assert.equal(isUsableImageVariant({ ...sizes.content!, mimeType: 'image/jpeg' }), false);
assert.equal(isUsableImageVariant({ ...sizes.content!, filesize: 0 }), false);
console.log('Media policy passed: valid formats, byte limits (including false size), pixel/side limits, corrupt/spoofed files, early hook, tiny WebP variants, missing/invalid output, metadata-only updates, public variant gate. No DB/S3 writes.');
