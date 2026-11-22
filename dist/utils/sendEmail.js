"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingEmail = void 0;
// email - booking hole customer + owner ke mail
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendBookingEmail = async (to, subject, text) => {
    try {
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;
        if (!user || !pass) {
            console.log('Email skipped - EMAIL_USER / EMAIL_PASS missing in .env');
            return;
        }
        // transporter ekhon vitore banabo - .env tokhon load hoye gese
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass.replace(/\s/g, ''),
            },
        });
        await transporter.sendMail({ from: user, to, subject, text });
        console.log('Email sent to', to);
    }
    catch (error) {
        console.log('Email failed:', error);
    }
};
exports.sendBookingEmail = sendBookingEmail;
