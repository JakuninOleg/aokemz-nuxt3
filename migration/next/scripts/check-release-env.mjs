// Read-only preflight. Never print secret values or connection strings.
const failures = [];
const required = ['DATABASE_URL', 'PAYLOAD_SECRET', 'PUBLIC_SITE_URL', 'S3_BUCKET', 'S3_ENDPOINT', 'S3_REGION', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'MAIL_TO'];
for (const name of required) if (!process.env[name]?.trim()) failures.push(`${name}: required`);
if ((process.env.PAYLOAD_SECRET || '').length < 32) failures.push('PAYLOAD_SECRET: minimum 32 characters');
try {
  const url = new URL(process.env.PUBLIC_SITE_URL);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) failures.push('PUBLIC_SITE_URL: must be an HTTPS origin');
  if (process.env.SITE_INDEXABLE === 'true' && url.origin !== 'https://aokemz.ru') failures.push('SITE_INDEXABLE: staging must remain false');
} catch { failures.push('PUBLIC_SITE_URL: invalid URL'); }
try {
  const url = new URL(process.env.DATABASE_URL);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) failures.push('DATABASE_URL: PostgreSQL required');
  if (!['verify-full', 'verify-ca'].includes(url.searchParams.get('sslmode'))) failures.push('DATABASE_URL: certificate-verified TLS required');
} catch { failures.push('DATABASE_URL: invalid URL'); }
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') failures.push('TLS certificate validation must not be disabled');
if (process.env.ALLOW_LOCAL_PREVIEW === 'true') failures.push('ALLOW_LOCAL_PREVIEW: must be false on public deployments');
if (process.env.TRUST_PROXY !== 'true') failures.push('TRUST_PROXY: confirm proxy overwrites forwarded headers before enabling public forms');
if (!['465', '587'].includes(process.env.SMTP_PORT || '465')) failures.push('SMTP_PORT: confirm TLS transport configuration');
if (!process.env.YANDEX_METRIKA_TOKEN) console.log('NOTICE: dashboard analytics are not configured');
for (const failure of failures) console.error(failure);
console.log(JSON.stringify({ releaseEnvValid: failures.length === 0, failureCount: failures.length, valuesRedacted: true }));
process.exitCode = failures.length ? 1 : 0;
