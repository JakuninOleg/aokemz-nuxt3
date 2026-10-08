// Mechanical reuse of approved content, validation, styles and referenced assets.
import { readFile, writeFile, copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('../..');
await mkdir('src/lib', { recursive: true });
for (const [source, target] of [['utils/contactValidation.ts','src/lib/contact-validation.ts'], ['utils/contactsContent.ts','src/lib/contacts-content.ts'], ['server/utils/leadEmail.ts','src/lib/lead-email.ts']]) {
  await writeFile(target, (await readFile(path.join(root,source),'utf8')).replaceAll('~/utils/contactValidation','@/lib/contact-validation'));
}
for (const name of ['contacts','about','production','documents','legal','catalog-light']) await copyFile(path.join(root,`assets/css/${name}.scss`),`src/styles/legacy/${name}.scss`);
for (const [component,name] of [['LeadSubmitState','lead-state'],['FormConsent','form-consent'],['CookieConsentBanner','cookie-banner'],['error/NotFoundPage','not-found']]) {
  const source = await readFile(path.join(root,`components/${component}.vue`),'utf8');
  await writeFile(`src/styles/legacy/${name}.scss`,source.match(/<style scoped[^>]*>([\s\S]*?)<\/style>/)[1].replaceAll(':deep(',':is('));
}
const refs = new Set(['/media/kemz-logo.webp']);
async function scan(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const file = path.join(dir,entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(ts|vue|scss)$/.test(entry.name)) {
      const source = await readFile(file,'utf8');
      for (const match of source.matchAll(/\/(?:media|news|docs|files)\/[\w\-/А-Яа-яЁё .]+\.(?:webp|png|jpe?g|svg|pdf|docx?)/g)) refs.add(match[0]);
    }
  }
}
for (const dir of ['utils','components','assets/css']) await scan(path.join(root,dir));
// These approved cards construct their image URLs from short asset names.
const homeContent = await readFile('src/lib/home-content.ts', 'utf8');
for (const match of homeContent.matchAll(/image:\s*'([\w-]+)'/g)) {
  refs.add(`/media/generated/${match[1]}-480.webp`);
  refs.add(`/media/generated/${match[1]}-720.webp`);
}
for (const ref of refs) {
  const source = path.join(root,'public',ref.slice(1)), dest = path.join('public',ref.slice(1));
  try { await mkdir(path.dirname(dest),{recursive:true}); await copyFile(source,dest); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (ref.endsWith('.webp')) for (const size of [480,640,720,960,1200,1600]) {
    const variant=ref.replace(/\.webp$/,`-${size}.webp`);
    try { await copyFile(path.join(root,'public',variant.slice(1)),path.join('public',variant.slice(1))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
console.log('Shared validation, email, contact content, approved styles and referenced assets synchronized.');
