import nodemailer from 'nodemailer';
import { H3Event, readBody } from 'h3';

export default async (event: H3Event) => {
  const body = await readBody(event);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true для 465 порта
    auth: {
      user: 'kemz.pao@gmail.com',
      pass: 'lvqkkgkyubgbjxel',
    },
  });

  try {
    await transporter.sendMail({
      from: '"ОАО "КЭМЗ"" <kemz.pao@gmail.com>',
      to: 'sales@aokemz.ru, oleg.kemz@gmail.com',
      subject: body.subject || 'Новое сообщение с сайта',
      text: body.text || '',
      html: body.html || '',
    });

    return { success: true };
  } catch (error) {
    console.error('Ошибка отправки письма:', error);
    return { success: false, error };
  }
};
