// Copy only the approved SMTP environment. Never print secret values.
import { readFile, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
const mailSource = parseEnv(await readFile('../../.env', 'utf8'));
const timewebSource = parseEnv(await readFile('../../.env.timeweb', 'utf8'));
let source=await readFile('.env.local','utf8');
const values=Object.fromEntries(['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','MAIL_FROM'].map(key=>[key,timewebSource[key] || mailSource[key] || '']));
if (!values.SMTP_USER || !values.SMTP_PASS) throw new Error('Root SMTP environment is incomplete; destination unchanged');
Object.assign(values,{MAIL_TO:'sales@aokemz.ru, oleg.kemz@gmail.com',PUBLIC_SITE_URL:'http://127.0.0.1:3100',ALLOW_LOCAL_PREVIEW:'true',SITE_INDEXABLE:'false'});
for (const [key,value] of Object.entries(values)) {
  const line=`${key}=${JSON.stringify(value)}`;
  const pattern=new RegExp(`^${key}\\s*=.*$`,'m');
  source=pattern.test(source)?source.replace(pattern,()=>line):source+`\n${line}`;
}
await writeFile('.env.local',source);
console.log('Local SMTP configuration copied; sales and owner recipients configured; preview remains noindex.');
