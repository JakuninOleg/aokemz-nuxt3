import assert from 'node:assert/strict';
import { createMailTransport, getMailSender } from '../src/lib/mail-transport';

// No .env load, no connect/send: inspect Nodemailer's constructed options only.
process.env.SMTP_HOST = 'smtp.example.test';
process.env.SMTP_USER = 'sender@example.test';
process.env.SMTP_PASS = 'test-only-not-a-secret';
for (const port of ['465', '587']) {
  process.env.SMTP_PORT = port;
  const transport = createMailTransport();
  const options = transport.options as { secure?: boolean; requireTLS?: boolean };
  assert.equal(options.secure, port === '465');
  assert.equal(options.requireTLS, port === '587');
  transport.close();
}
assert.deepEqual(getMailSender('sender@example.test'), { name: 'ОАО «КЭМЗ»', address: 'sender@example.test' });
console.log('Mail transport: implicit TLS / mandatory STARTTLS and sender checks PASS. No connection or mail sent.');
