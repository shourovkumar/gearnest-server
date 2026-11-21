// email - booking hole customer + owner ke mail
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingEmail = async (to: string, subject: string, text: string) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log("Email skipped - no EMAIL_USER in env");
      return;
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log("Email sent to", to);
  } catch (error) {
    console.log("Email failed:", error);
  }
};
