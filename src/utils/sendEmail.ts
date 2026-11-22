// email - booking hole customer + owner ke mail
import nodemailer from 'nodemailer';

export const sendBookingEmail = async (to: string, subject: string, text: string) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.log('Email skipped - EMAIL_USER / EMAIL_PASS missing in .env');
      return;
    }

    // transporter ekhon vitore banabo - .env tokhon load hoye gese
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass.replace(/\s/g, ''),
      },
    });

    await transporter.sendMail({ from: user, to, subject, text });
    console.log('Email sent to', to);
  } catch (error) {
    console.log('Email failed:', error);
  }
};
