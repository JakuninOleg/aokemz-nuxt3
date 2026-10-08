import { handleLead } from '@/lib/lead-handler';
import { createMailTransport, getMailSender } from '@/lib/mail-transport';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createLeadStore } from '@/lib/lead-store';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  // Only trust forwarded IP if the deployment proxy replaces incoming headers.
  const ip = process.env.TRUST_PROXY === 'true' ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown' : 'unknown';
  // Lazy initialization: invalid/honeypot requests never need the database.
  const store = {
    reserve: async (input: Parameters<ReturnType<typeof createLeadStore>['reserve']>[0]) => createLeadStore(await getPayload({ config })).reserve(input),
    finish: async (id: number, status: 'sent' | 'failed') => createLeadStore(await getPayload({ config })).finish(id, status),
  };
  return handleLead(request, async email => {
    const transport = createMailTransport();
    try { await transport.sendMail({ ...email, from: getMailSender(),
      to: process.env.MAIL_TO || 'sales@aokemz.ru, oleg.kemz@gmail.com', disableFileAccess: true, disableUrlAccess: true }); }
    finally { transport.close(); }
  }, ip, store);
}
