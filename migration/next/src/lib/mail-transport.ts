import nodemailer from 'nodemailer';
import type { EmailAdapter } from 'payload';
export function getMailSender(configured = process.env.MAIL_FROM, smtpUser = process.env.SMTP_USER) {
  const sender = configured?.trim() || smtpUser?.trim() || '';
  // A bare MAIL_FROM address must not erase the company's display name.
  return sender.includes('<') ? sender : { name: 'ОАО «КЭМЗ»', address: sender };
}
export function createMailTransport() {
  const user=process.env.SMTP_USER, pass=process.env.SMTP_PASS;
  if (!user || !pass) throw new Error('Mail transport is not configured');
  const port=Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({host:process.env.SMTP_HOST || 'smtp.gmail.com',port,secure:port===465,
    auth:{user,pass},connectionTimeout:10_000,greetingTimeout:10_000,socketTimeout:20_000});
}
// Never use Payload's console adapter: reset tokens must not enter server logs.
export const cmsEmailAdapter: EmailAdapter = () => ({
  name:'kemz-smtp', defaultFromAddress:process.env.SMTP_USER || 'sales@aokemz.ru', defaultFromName:'ОАО «КЭМЗ»',
  async sendEmail(message) {
    const transport=createMailTransport();
    try { return await transport.sendMail({...message,disableFileAccess:true,disableUrlAccess:true}); }
    finally {transport.close();}
  },
});
